import { gql } from "@/lib/graphql";
import { getClient, query } from "@/lib/apollo";
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

  const { data } = await query({
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

  if (!data?.nodeArticle) {
    return null;
  }

  return data.nodeArticle;
}

export async function getNewsArticlePageCount() {
  const { data } = await query({
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

  if (!data?.legacyNews) {
    return 0;
  }

  return Math.ceil(data.legacyNews.pageInfo.total / data.legacyNews.pageInfo.pageSize);
}

export async function getNewsArticles(page: number) {
  // This function is used in a Server Active, so we need to use getClient to get the query function, otherwise it will create multiple ApolloClient instances.
  const query = getClient().query;

  const { data } = await query({
    query: gql(/* gql */ `
      query GetNewsArticles($page: Int = 0) {
        legacyNews(page: $page) {
          results {
            ...NewsWithoutBody
          }
        }
      }
    `),
    variables: {
      page: page,
    },
  });

  if (!data?.legacyNews) {
    return [];
  }

  return data.legacyNews.results as NewsWithoutBodyFragment[];
}

export async function getFeaturedNewsArticles() {
  const { data } = await query({
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

  if (!data?.featuredLegacyNews) {
    return [];
  }

  return data.featuredLegacyNews.results as NewsWithoutBodyFragment[];
}
