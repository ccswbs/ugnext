import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { NewsFragment } from "@/lib/graphql/types";

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
      ...Tag
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
