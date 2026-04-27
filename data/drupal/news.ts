import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { NewsFragment, NewsWithoutContentFragment } from "@/lib/graphql/types";
import { ProcessedWidget, WidgetProcessor } from "@/data/drupal/widgets";
import { cache } from "react";
import { ProcessedBasicPage } from "@/data/drupal/basic-page";

export const NEWS_WITHOUT_CONTENT = gql(/* gql */ `
  fragment NewsWithoutContent on NodeNews {
    id
    title
    path
    status
    unit {
      ...Unit
    }
    category {
      ...NewsCategory
    }
    externalLink {
      url
      title
    }
    hero {
      attribution {
        url
        title
      }
      image {
        alt
        url
        width
        height
        variations(styles: FOCAL_POINT600X400) {
          url
          width
          height
        }
      }
    }
    externallyLinked
    leadParagraph
  }
`);

export const NEWS_FRAGMENT = gql(/* gql */ `
  fragment News on NodeNews {
    ...NewsWithoutContent
    datePublished {
      time
    }
    dateUpdated {
      time
    }
    author
    heroDescription
    primaryNavigation {
      ...Navigation
      ... on TermPrimaryNavigation {
        name
        menuName
        customFooter {
          id
          title
        }
        homePage {
          url
          title
        }
        newsHomePage {
          url
          title
        }
        newsDirectoryPage {
          url
          title
        }
      }
    }
    tags {
      ...Tag
    }
    doNotDisplayImage
    widgets {
      __typename
      ...GeneralText
      ...MediaText
      ...Block
      ...RelatedContent
      ...ButtonSection
    }
  }
`);

export function getNewsBreadcrumb(article: NewsFragment) {
  const values = {
    unitHome: {
      url: "",
      title: "",
    },
    newsHome: {
      url: "",
      title: "",
    },
    directory: {
      url: "",
      title: "",
    },
  };

  if (!article.primaryNavigation) {
    return values;
  }

  if (article.primaryNavigation.menuName === "no-menu") {
    values.unitHome.url = "/news";
    values.unitHome.title = "News";
    values.directory.url = "/news/directory";
    values.directory.title = "News Directory";
    return values;
  }

  // Get primary Navigation homepage
  if (article.primaryNavigation.homePage?.url) {
    values.unitHome.url = article.primaryNavigation.homePage.url;
    values.unitHome.title = article.primaryNavigation.homePage.title ?? "";
  }

  if (article.primaryNavigation.newsHomePage?.url) {
    values.newsHome.url = article.primaryNavigation.newsHomePage.url;
    values.newsHome.title = article.primaryNavigation.newsHomePage.title ?? `${article.primaryNavigation.name} News`;
  }

  if (article.primaryNavigation.newsDirectoryPage?.url) {
    values.directory.url = article.primaryNavigation.newsDirectoryPage.url;
    values.directory.title =
      article.primaryNavigation.newsDirectoryPage.title ?? `${article.primaryNavigation.name} News Directory`;
  }

  return values;
}

export type FullNewsArticle = Omit<NewsFragment, "widgets"> & {
  unitHome: {
    url: string;
    title: string;
  };
  newsHome: {
    url: string;
    title: string;
  };
  directory: {
    url: string;
    title: string;
  };
  widgets: ProcessedWidget[];
};

export async function getNewsArticle(id: string) {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetNewsArticle($id: ID = "", $revision: ID = "current") {
        nodeNews(id: $id, revision: $revision) {
          ...News
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    console.error(`GraphQL Error: failed to retrieve content for news article ${id}:\n\t${error}\n`);
    return null;
  }

  if (!data?.nodeNews) {
    return null;
  }

  if (data.nodeNews.status === false && !showUnpublished) {
    return null;
  }

  const { unitHome, newsHome, directory } = getNewsBreadcrumb(data.nodeNews);
  const processor = new WidgetProcessor();

  return {
    ...(data.nodeNews as NewsFragment),
    unitHome: unitHome,
    newsHome: newsHome,
    directory: directory,
    widgets: await processor.processWidgets(data.nodeNews.widgets ?? []),
  } as FullNewsArticle;
}

export const VALID_PAGE_SIZES = [5, 10, 20, 25, 50];

export type NewsSearchOptions = {
  query?: string;
  page: number;
  pageSize: number;
  units?: string[];
  categories?: string[];
  tags?: string[];
};

export async function getFilteredNews(options: NewsSearchOptions) {
  const { query, page = 0, pageSize = 20, units, categories, tags } = options;

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    console.error(`Invalid page size: ${pageSize}. Valid page sizes are: ${VALID_PAGE_SIZES.join(", ")}`);

    return {
      results: [],
      totalPages: 0,
      total: 0,
    };
  }

  const client = getClient();
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query NewsSearch(
        $page: Int
        $pageSize: Int
        $units: [String]
        $categories: [String]
        $tags: [String]
        $query: String
        $status: Boolean
      ) {
        newsSearch(
          page: $page
          pageSize: $pageSize
          filter: { units: $units, categories: $categories, tags: $tags, query: $query, status: $status }
        ) {
          results {
            ...NewsWithoutContent
          }
          pageInfo {
            pageSize
            total
          }
        }
      }
    `),
    variables: {
      page: page,
      pageSize: pageSize,
      units: units ?? [],
      categories: categories ?? [],
      tags: tags ?? [],
      query: query ?? "",
      status: showUnpublished ? null : true,
    },
  });

  if (error || !data || !data.newsSearch) {
    console.error(`GraphQL Error: failed to retrieve news articles:\n\t${error}\n`);
    return {
      results: [],
      totalPages: 0,
      total: 0,
    };
  }

  let results = data.newsSearch.results as NewsWithoutContentFragment[];

  if (showUnpublished) {
    // The search database only indexes the current revision of a node, so we need to fetch the latest revision.
    // Map each result to its latest revision.
    // Unfortunately, this means making a request for each result individually.
    // This is not ideal as it is bad for performance,
    // but it is the best we can do for now,
    // and since this will only be used in draft mode or the dev server, it should be fine.

    const latestRevisionQuery = gql(/* gql */ `
      query LatestRevisionNews($id: ID!) {
        nodeNews(id: $id, revision: "latest") {
          ...NewsWithoutContent
        }
      }
    `);

    results = await Promise.all(
      results.map(async (result) => {
        const { data } = await client.query({
          query: latestRevisionQuery,
          variables: { id: result.id },
        });

        if (!data || !data.nodeNews) {
          console.warn(
            `Failed to fetch latest revision for news article ${result.id}, falling back to original result`
          );
          return result;
        }

        return data.nodeNews;
      })
    );
  }

  return {
    results: results,
    totalPages: Math.ceil(data.newsSearch.pageInfo.total / options.pageSize),
    total: data.newsSearch.pageInfo.total,
  };
}

export async function getAllNewsCategories() {
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetAllNewsCategories {
        termNewsCategories(first: 100) {
          nodes {
            ...NewsCategory
          }
        }
      }
    `),
  });

  if (error) {
    console.error(`GraphQL Error: failed to retrieve news categories:\n\t${error}\n`);
    return [];
  }

  if (!data) {
    return [];
  }

  if (!data.termNewsCategories) {
    return [];
  }

  return data.termNewsCategories.nodes;
}

export async function getPageContent(id: string): Promise<ProcessedBasicPage | null> {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query BasicPageContent($id: ID!, $revision: ID = "current") {
        nodePage(id: $id, revision: $revision) {
          ...BasicPage
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    console.error(`GraphQL Error: failed to retrieve content for basic page ${id}:\n\t${error}\n`);
    return null;
  }

  if (!data?.nodePage) {
    return null;
  }

  if (data.nodePage.status === false && !showUnpublished) {
    return null;
  }

  if (!data.nodePage.widgets) {
    return {
      ...data.nodePage,
      widgets: [] as ProcessedWidget[],
    };
  }

  const processor = new WidgetProcessor();
  return {
    ...data.nodePage,
    widgets: await processor.processWidgets(data.nodePage.widgets),
  };
}

async function getAllNewsArticlePathsUncached() {
  const client = getClient();

  const pathQuery = gql(/* gql */ `
    query NewsPaths($cursor: Cursor) {
      nodeNewsItems(after: $cursor, first: 100) {
        nodes {
          __typename
          id
          status
          path
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const paths: string[] = [];

  while (hasNextPage) {
    const { data, error } = await client.query({
      query: pathQuery,
      variables: {
        cursor,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    if (!data) {
      return paths;
    }

    if (!data.nodeNewsItems.nodes.length) {
      return paths;
    }

    const currentPaths = data.nodeNewsItems.nodes
      .filter((page) => page.status)
      .map((page) => page.path)
      .filter((path) => typeof path === "string");

    paths.push(...currentPaths);

    cursor = data.nodeNewsItems.pageInfo.endCursor;
    hasNextPage = data.nodeNewsItems.pageInfo.hasNextPage;
  }

  return paths;
}
export const getAllNewsArticlePaths = cache(getAllNewsArticlePathsUncached);
