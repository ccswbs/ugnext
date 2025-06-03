import { graphql } from "@/lib/drupal";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  // We want to redirect requests for /node/{ID} to the appropriate place.

  // Check the type of the node
  const { data } = await graphql(
    `
      query ($url: String!) {
        route(path: $url) {
          ... on RouteInternal {
            entity {
              __typename
            }
          }
        }
      }
    `,
    {
      url: "/node/" + context.params.slug.join("/"),
    }
  );

  switch (data.route?.entity?.__typename) {
    // For spotlight, we want to redirect to the homepage, as that's where they appear
    case "NodeSpotlight":
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    //  For LegacyNews (Articles) redirect to /ovc-news/
    case "NodeArticle":
      return {
        redirect: {
          destination: "/ovc/news/archive/april20255",
          permanent: true,
        },
      };
    // Fallback to showing 404 if we haven't defined redirect logic for a node type.
    default:
      return {
        notFound: true,
      };
  }
}

export default function Node() {
  return "";
}
