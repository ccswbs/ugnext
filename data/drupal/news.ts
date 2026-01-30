import { gql } from "@/lib/graphql";
import { getClient } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { NewsFragment, NewsWithoutContentFragment } from "@/lib/graphql/types";

export const NEWS_WITHOUT_CONTENT = gql(/* gql */ `
  fragment NewsWithoutContent on NodeNews {
    id
    title
    status
    primaryNavigation {
      ...Navigation
    }
    unit {
      ...Unit
    }
    category {
      ...NewsCategory
    }
    tags {
      __typename
      ...Tag
      ...Unit
    }
    externalLink {
      url
      title
    }
    hero {
      ...Image
    }
    externallyLinked
  }
`);

export const NEWS_FRAGMENT = gql(/* gql */ `
  fragment News on NodeNews {
    ...NewsWithoutContent
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
  query: string;
  page: number;
  pageSize: number;
  unit: string;
  categories: string[];
};

export async function getFilteredNews(options: NewsSearchOptions) {
  const { query = "", page = 0, pageSize = 20, unit = "", categories = [] } = options;

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    throw new Error(`Invalid page size: ${pageSize}. Valid page sizes are: ${VALID_PAGE_SIZES.join(", ")}`);
  }

  const client = getClient();
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query NewsSearch {
        nodeNewsItems(first: 100) {
          nodes {
            ...NewsWithoutContent
          }
        }
      }
    `),
  });

  if (error) {
    console.error(`GraphQL Error: failed to retrieve news articles:\n\t${error}\n`);
    return [];
  }

  if (!data?.nodeNewsItems?.nodes) {
    return [];
  }

  const articles = data.nodeNewsItems.nodes as NewsWithoutContentFragment[];

  return {
    results: articles,
    totalPages: 1,
    total: articles.length,
  };
}
