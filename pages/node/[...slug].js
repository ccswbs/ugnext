import { graphql } from "@/lib/drupal";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  // We want to redirect requests for /node/{ID} to the appropriate place.

  console.log("Checking type of " + "/node/" + context.params.slug.join("/"));

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

  console.log("type is " + data.route?.entity?.__typename);

  switch (data.route?.entity?.__typename) {
    // For spotlight, we want to redirect to the homepage, as that's where they appear
    case "NodeSpotlight":
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    case "NodeUndergraduateProgram":
    case "NodeUndergraduateDegree":
      return {
        redirect: {
          destination: "/programs/undergraduate",
          permanent: true,
        },
      };
    case "NodeUndergraduateRequirement":
      return {
        redirect: {
          destination: "/programs/undergraduate/requirements",
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
