import { gql } from "@/lib/graphql";

// Spread as `relatedContent { ...RelatedContentGroup }` on any content type that has a related content field
export const RELATED_CONTENT_GROUP_FRAGMENT = gql(/* gql */ `
  fragment RelatedContentGroup on ParagraphRelatedContent {
    contentLabel
    headingLevel
    content {
      __typename
      ... on NodeEvent {
        path
        title
      }
      ... on NodeNews {
        path
        title
      }
      ... on NodePage {
        path
        title
      }
      ... on NodeProfile {
        path
        title
      }
    }
  }
`);
