import { gql } from "@/lib/graphql";
import { getClient } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { NewsFragment, NewsWithoutContentFragment } from "@/lib/graphql/types";

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
    primaryNavigation {
      ...Navigation
      ... on TermPrimaryNavigation {
        newsUrlAliasPattern
        name
        primaryNavigationUrl {
          url
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
      ...Buttons
      ...RelatedContent
    }
  }
`);

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

  return data.nodeNews as NewsFragment;
}

export const VALID_PAGE_SIZES = [5, 10, 20, 25, 50];

export type NewsSearchOptions = {
  query?: string;
  page: number;
  pageSize: number;
  units?: string[];
  categories?: string[];
};

export async function getFilteredNews(options: NewsSearchOptions) {
  const { query, page = 0, pageSize = 20, units, categories } = options;

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
        $query: String
        $status: Boolean
      ) {
        newsSearch(
          page: $page
          pageSize: $pageSize
          filter: { units: $units, categories: $categories, query: $query, status: $status }
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
