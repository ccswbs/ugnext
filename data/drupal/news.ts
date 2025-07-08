import { gql } from "@/lib/graphql";
import { query } from "@/lib/apollo";
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
      query GetNewsArticle($id: ID!, $revision: ID = "current") {
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

export async function getNewsList() {
  const { data } = await query({
    query: gql(/* gql */ `
      query GetNewsList {
        legacyNews {
          results {
            ...NewsWithoutBody
          }
        }
      }
    `),
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
