import { getClient, handleGraphQLError, query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { RouteQuery, RouteBreadcrumbsQuery } from "@/lib/graphql/types";

export type Route = NonNullable<RouteQuery["route"]>;

export async function getRoute(url: string) {
  const showUnpublished = await showUnpublishedContent();
  const query = getClient().query;
  const routeQuery = gql(/* gql */ `
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
            ... on NodeUndergraduateDegree {
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
              weight
            }
            ... on NodeUndergraduateRequirement {
              uuid
              id
              title
            }
          }
        }
        ... on RouteRedirect {
          status
          url
        }
      }
    }
  `);

  const { data, error } = await query({
    query: routeQuery,
    variables: {
      path: url,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (!data) {
    handleGraphQLError(error);
  }

  if (showUnpublished && data.route?.__typename === "RouteInternal" && data.route.entity === null) {
    // For some reason, the route is found, but the entity is null.
    // This only happens when we are looking for the latest revision and the entity has no revisions.
    // We need to query again with the current revision.
    const { data, error } = await query({
      query: routeQuery,
      variables: {
        path: url,
        revision: "current",
      },
    });

    if (!data) {
      handleGraphQLError(error);
    }

    return data.route;
  }

  switch (data.route?.__typename) {
    case "RouteInternal":
    case "RouteRedirect":
      return data?.route;
    default:
      return null;
  }
}

export async function getRouteBreadcrumbs(url: string) {
  const { data, error } = await query({
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

  if (!data) {
    handleGraphQLError(error);
  }

  switch (data.route?.__typename) {
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
