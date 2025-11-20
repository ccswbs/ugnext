import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError } from "@/lib/apollo";
import { NewsWithoutBodyFragment } from "@/lib/graphql/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";

export const NEWS_FRAGMENT = gql(/* gql */ `
  fragment News on NodeArticle {
    id
    title
    doNotDisplayImage
    created {
      time
      timestamp
    }
    body {
      processed
    }
    newsCategory {
      ...NewsCategory
    }
    heroImage {
      ...Image
    }
  }
`);

export const NEWS_WITHOUT_BODY_FRAGMENT = gql(/* gql */ `
  fragment NewsWithoutBody on NodeArticle {
    id
    title
    created {
      time
      timestamp
    }
    newsCategory {
      ...NewsCategory
    }
    heroImage {
      ...Image
    }
  }
`);

export async function getNewsArticle(id: string) {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetNewsArticle($id: ID = "", $revision: ID = "current") {
        nodeArticle(id: $id, revision: $revision) {
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
    handleGraphQLError(error);
  }

  if (!data) {
    return null;
  }

  if (!data.nodeArticle) {
    return null;
  }

  return data.nodeArticle;
}

export async function getNewsArticleCount() {
  const client = getClient();
  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetNewsArticlePageCount {
        legacyNews(page: 0) {
          pageInfo {
            total
            pageSize
          }
        }
      }
    `),
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return 0;
  }

  if (!data.legacyNews) {
    return 0;
  }

  return data.legacyNews.pageInfo.total;
}

export type OVCNewsWithoutBody = NewsWithoutBodyFragment;

export async function getNewsArticles(page: number, pageSize: number = 20) {
  const VALID_PAGE_SIZES = [5, 10, 20, 25, 50];

  // This function is used in a Server Action, so we need to use getClient to get the client, otherwise it will create multiple ApolloClient instances.
  const client = getClient();

  if (page < 0) {
    throw new Error(`Page number must be greater than or equal to 0.`);
  }

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    throw new Error(`Page size must be one of ${VALID_PAGE_SIZES.join(", ")}.`);
  }

  if (page > Math.ceil((await getNewsArticleCount()) / pageSize)) {
  }

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetNewsArticles($page: Int = 0, $pageSize: Int = 20) {
        legacyNews(page: $page, pageSize: $pageSize) {
          results {
            ...NewsWithoutBody
          }
          pageInfo {
            total
          }
        }
      }
    `),
    variables: {
      page: page,
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return {
      results: [],
      total: 0,
      totalPages: 0,
    };
  }

  if (!data.legacyNews) {
    return {
      results: [],
      total: 0,
      totalPages: 0,
    };
  }

  return {
    results: data.legacyNews.results as OVCNewsWithoutBody[],
    total: data.legacyNews.pageInfo.total,
    totalPages: Math.ceil(data.legacyNews.pageInfo.total / pageSize),
  };
}

export async function getFeaturedNewsArticles() {
  const client = getClient();
  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetFeaturedNewsArticles {
        featuredLegacyNews {
          results {
            ...NewsWithoutBody
          }
        }
      }
    `),
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  if (!data.featuredLegacyNews) {
    return [];
  }

  return data.featuredLegacyNews.results as NewsWithoutBodyFragment[];
}
