import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { permanentRedirect, redirect } from "next/navigation";

export async function getPageContent(url: string) {
  const { data } = await query({
    query: gql(/* gql */ `
      query BasicPageContent($path: String!, $revision: ID = "current") {
        route(path: $path, revision: $revision) {
          __typename
          ... on RouteInternal {
            breadcrumbs {
              url
              title
            }
            entity {
              __typename
              ...BasicPage
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

  // This path is redirecting to another
  if (data?.route?.__typename === "RouteRedirect") {
    if (data.route.status === 301) {
      permanentRedirect(data.route.url);
    } else {
      redirect(data.route.url);
    }
  }

  // This path doesn't point to a basic page,
  if (data?.route?.__typename !== "RouteInternal" || data?.route?.entity?.__typename !== "NodePage") {
    return null;
  }
}
