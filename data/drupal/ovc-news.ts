import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
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

  const { data, error } = await query({
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
  const { data, error } = await query({
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

export async function getNewsArticles(page: number, size: number = 20) {
  // This function is used in a Server Active, so we need to use getClient to get the query function, otherwise it will create multiple ApolloClient instances.
  const query = getClient().query;

  const { data, error } = await query({
    query: gql(/* gql */ `
      query GetNewsArticles($page: Int = 0, $size: Int = 20) {
        legacyNews(page: $page, pageSize: $size) {
          results {
            ...NewsWithoutBody
          }
        }
      }
    `),
    variables: {
      page: page,
      size: size,
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  if (!data.legacyNews) {
    return [];
  }

  return data.legacyNews.results as OVCNewsWithoutBody[];
}

export async function getFeaturedNewsArticles() {
  const { data, error } = await query({
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
    return null;
  }

  if (!data.featuredLegacyNews) {
    return [];
  }

  return data.featuredLegacyNews.results as NewsWithoutBodyFragment[];
}
