import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { PageTypeQuery } from "@/lib/graphql/types";

export type Route = NonNullable<PageTypeQuery["route"]>;
export type InternalRoute = Extract<Route, { __typename: "RouteInternal" }>;
export type RedirectRoute = Extract<Route, { __typename: "RouteRedirect" }>;
export type InternalRouteBreadcrumbs = InternalRoute["breadcrumbs"];
export type InternalRouteEntity = NonNullable<InternalRoute["entity"]>;
export type InternalRouteEntityWithTitle = Extract<InternalRouteEntity, { title: string }>;

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
                title
              }
              ... on NodeCallToAction {
                uuid
                title
              }
              ... on NodeCareer {
                uuid
                title
              }
              ... on NodeCourse {
                uuid
                title
              }
              ... on NodeCustomFooter {
                uuid
                title
              }
              ... on NodeEmployer {
                uuid
                title
              }
              ... on NodeEvent {
                uuid
                title
              }
              ... on NodePage {
                uuid
                title
              }
              ... on NodeProgram {
                uuid
                title
              }
              ... on NodeSpotlight {
                uuid
                title
              }
              ... on NodeTestimonial {
                uuid
                title
              }
              ... on NodeUserDocumentation {
                uuid
                title
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
