import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { RouteQuery, RouteBreadcrumbsQuery } from "@/lib/graphql/types";

export type Route = NonNullable<RouteQuery["route"]>;

export async function getRoute(url: string) {
  const { data } = await query({
    query: gql(/* gql */ `
      query Route($path: String!, $revision: ID = "current") {
        route(path: $path, revision: $revision) {
          __typename
          ... on RouteInternal {
            entity {
              __typename
              ... on NodeArticle {
                uuid
                id
                title
              }
              ... on NodeCallToAction {
                uuid
                id
                title
              }
              ... on NodeCareer {
                uuid
                id
                title
              }
              ... on NodeCourse {
                uuid
                id
                title
              }
              ... on NodeCustomFooter {
                uuid
                id
                title
              }
              ... on NodeEmployer {
                uuid
                id
                title
              }
              ... on NodeEvent {
                uuid
                id
                title
              }
              ... on NodePage {
                uuid
                id
                title
              }
              ... on NodeProgram {
                uuid
                id
                title
              }
              ... on NodeSpotlight {
                uuid
                id
                title
              }
              ... on NodeTestimonial {
                uuid
                id
                title
              }
              ... on NodeUserDocumentation {
                uuid
                id
                title
              }
              ... on NodeUndergraduateProgram {
                uuid
                id
                title
              }
              ... on TermUndergraduateStudentType {
                uuid
                id
                name
              }
              ... on TermAdmissionLocation {
                uuid
                id
                name
                type
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

export async function getRouteBreadcrumbs(url: string) {
  const { data } = await query({
    query: gql(/* gql */ `
      query RouteBreadcrumbs($path: String!, $revision: ID = "current") {
        route(path: $path, revision: $revision) {
          __typename
          ... on RouteInternal {
            breadcrumbs {
              __typename
              title
              url
            }
            entity {
              ... on NodeArticle {
                title
              }
              ... on NodeCallToAction {
                title
              }
              ... on NodeCareer {
                title
              }
              ... on NodeCourse {
                title
              }
              ... on NodeCustomFooter {
                title
              }
              ... on NodeEmployer {
                title
              }
              ... on NodeEvent {
                title
              }
              ... on NodePage {
                title
              }
              ... on NodeProgram {
                title
              }
              ... on NodeSpotlight {
                title
              }
              ... on NodeTestimonial {
                title
              }
              ... on NodeUserDocumentation {
                title
              }
            }
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
      if (!data.route.entity || !("title" in data.route.entity)) {
        return null;
      }

      if (!Array.isArray(data.route.breadcrumbs)) {
        return [
          {
            title: data.route.entity.title,
          },
        ];
      }

      return [
        ...data.route.breadcrumbs.filter((breadcrumb) => {
          if (!breadcrumb.title) {
            return false;
          }

          return breadcrumb.url !== "/";
        }),
        {
          title: data.route.entity.title,
        },
      ];
    default:
      return null;
  }
}
