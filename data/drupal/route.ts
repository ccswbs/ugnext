import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";

export async function getRouteInfo(url: string) {
  const { data } = await query({
    query: gql(/* gql */ `
      query PageType($path: String!, $revision: ID = "current") {
        route(path: $path, revision: $revision) {
          __typename
          ... on RouteInternal {
            breadcrumbs {
              url
              title
            }
            entity {
              __typename
              ... on MediaAudio {
                uuid
              }
              ... on MediaFile {
                uuid
              }
              ... on MediaImage {
                uuid
              }
              ... on MediaRemoteVideo {
                uuid
              }
              ... on MediaVideo {
                uuid
              }
              ... on TermPrimaryNavigation {
                uuid
              }
              ... on TermTag {
                uuid
              }
              ... on NodeArticle {
                uuid
              }
              ... on NodeCallToAction {
                uuid
              }
              ... on NodeCareer {
                uuid
              }
              ... on NodeCourse {
                uuid
              }
              ... on NodeCustomFooter {
                uuid
              }
              ... on NodeEmployer {
                uuid
              }
              ... on NodeEvent {
                uuid
              }
              ... on NodePage {
                uuid
              }
              ... on NodeProgram {
                uuid
              }
              ... on NodeSpotlight {
                uuid
              }
              ... on NodeTestimonial {
                uuid
              }
              ... on NodeUserDocumentation {
                uuid
              }
              ... on BlockContentBasic {
                uuid
              }
              ... on BlockContentWidgetBlock {
                uuid
              }
              ... on BlockContentYamlBlock {
                uuid
              }
            }
          }
          ... on RouteRedirect {
            status
            url
          }
        }
      }
    `),
    variables: {
      path: url,
      revision: (await showUnpublishedContent()) ? "latest" : "current",
    },
  });

  switch (data?.route?.__typename) {
    case "RouteInternal":
    case "RouteRedirect":
      return data?.route;
    default:
      return null;
  }
}
