import { getClient, handleGraphQLError } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { RouteQuery, RouteBreadcrumbsQuery, NodePage } from "@/lib/graphql/types";
import { getMenuLinkByURI } from "@/data/drupal/menu";
import { Link, RouteEntityUnion } from "@/lib/graphql/graphql";

export type Route = NonNullable<RouteQuery["route"]>;

export async function getRoute(url: string) {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();
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
            ... on NodeProfile {
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
            ... on TermProfileType {
              uuid
              id
              name
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

  const { data, error } = await client.query({
    query: routeQuery,
    variables: {
      path: url,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return null;
  }

  if (showUnpublished && data.route?.__typename === "RouteInternal" && data.route.entity === null) {
    // For some reason, the route is found, but the entity is null.
    // This only happens when we are looking for the latest revision and the entity has no revisions.
    // We need to query again with the current revision.
    const { data, error } = await client.query({
      query: routeQuery,
      variables: {
        path: url,
        revision: "current",
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    if (!data) {
      return null;
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

export async function checkIsEntityInMenu(
  entity_id: string,
  entity_path: string | null | undefined,
  primary_navigation: string | undefined
) {
  if (primary_navigation) {
    const entityNodeURL = entity_id ? `node/${entity_id}` : null;
    const checkMenuForEntityID = entityNodeURL ? await getMenuLinkByURI(entityNodeURL, primary_navigation) : null;

    // Check both node URL and path URL
    if (!checkMenuForEntityID || checkMenuForEntityID?.length === 0) {
      const checkMenuForEntityPath = entity_path ? await getMenuLinkByURI(entity_path, primary_navigation) : null;
      if (!checkMenuForEntityPath || checkMenuForEntityPath?.length === 0) {
        return false;
      }
    }
  }
  return true;
}

function filterBreadcrumbs(breadcrumbs: Link[], currentPage: { title: string }) {
  // Filter out elements without titles and the root from Breadcrumb Path
  let breadcrumbPath = breadcrumbs.filter((breadcrumb) => {
    if (!breadcrumb.title) {
      return false;
    }
    return breadcrumb.url !== "/";
  });

  // Remove last breadcrumb item if same as current page
  if (breadcrumbPath.length > 0) {
    const lastBreadcrumbItem = breadcrumbPath[breadcrumbPath.length - 1];
    if (currentPage.title === lastBreadcrumbItem?.title && lastBreadcrumbItem?.url === "") {
      if (breadcrumbPath.length > 1) {
        // pop returns undefined if only one item
        breadcrumbPath.pop();
      } else {
        breadcrumbPath = [];
      }
    }
  }

  return breadcrumbPath;
}

// Route assumes we are using Menu-generated Breadcrumbs instead of Path-based Breadcrumbs
export async function getRouteBreadcrumbs(url: string, primary_navigation: string | undefined) {
  const client = getClient();
  const breadcrumbsQuery = gql(/* gql */ `
    query RouteBreadcrumbs($path: String!, $revision: ID = "current") {
      route(path: $path, revision: $revision) {
        __typename
        ... on RouteInternal {
          breadcrumbs {
            __typename
            title
            url
            internal
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
              id
              path
              title
              primaryNavigation {
                menuName
                primaryNavigationUrl {
                  title
                  url
                }
              }
            }
            ... on NodeProfile {
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
          }
        }
      }
    }
  `);

  const { data, error } = await client.query<RouteBreadcrumbsQuery>({
    query: breadcrumbsQuery as any,
    variables: {
      path: url,
      revision: (await showUnpublishedContent()) ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return null;
  }

  switch (data.route?.__typename) {
    case "RouteInternal":
      if (!data.route.entity || !("title" in data.route.entity)) {
        return null;
      }

      let currentPage = {
        title: data.route.entity.title,
      };

      if (!Array.isArray(data.route.breadcrumbs)) {
        return [currentPage];
      }

      let breadcrumbPath = filterBreadcrumbs(data.route.breadcrumbs, currentPage);

      /* ---- Handle Basic Pages with Primary Navigation Homepage URL --- */
      if (data.route.entity.__typename === "NodePage" && data.route.entity.primaryNavigation?.primaryNavigationUrl) {
        const primaryNavigationHome = {
          title: data.route.entity.primaryNavigation?.primaryNavigationUrl?.title,
          url: data.route.entity.primaryNavigation?.primaryNavigationUrl?.url,
        };

        /* ---- Handle pages that are NOT in the menu --- */
        // If page NOT in menu, return [Primary Nav Home > currentPage]
        const isPageInMenu = await checkIsEntityInMenu(
          data.route.entity.id,
          data.route.entity.path,
          primary_navigation
        );
        if (!isPageInMenu) {
          return [primaryNavigationHome, currentPage];
        }

        // Only add Primary Nav Homepage URL if NOT already at start of breadcrumbPath
        if (primaryNavigationHome && breadcrumbPath[0]?.url !== primaryNavigationHome.url) {
          // If Primary Nav Home and currentPage are SAME, only return [ Primary Nav Home ]
          if (primaryNavigationHome.title === currentPage.title && breadcrumbPath.length === 0) {
            return [primaryNavigationHome];
          }

          /* ---- Handle pages in MULTIPLE MENUS --- */
          // Pages in multiple menus can have breadcrumb path from a different menu than Primary Navigation
          // If page in multiple menus, return [Primary Nav Home > currentPage]
          if (data.route.entity.primaryNavigation?.menuName !== primary_navigation) {
            return [primaryNavigationHome, currentPage];
          }

          // Default return
          return [primaryNavigationHome, ...breadcrumbPath, currentPage];
        }
      }

      // Handle content without Primary Navigation
      return [...breadcrumbPath, currentPage];
    default:
      return null;
  }
}
