import { registerApolloClient, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import type { ErrorLike } from "@apollo/client";

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new BatchHttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: `${DRUPAL_BASE_URL}/graphql`,
      headers: {
        "api-key": process.env.DRUPAL_API_KEY ?? "",
      },
    }),
  });
});

export async function onlyPublished() {
  return (await showUnpublishedContent()) ? null : true;
}

export function handleGraphQLError(error: ErrorLike | undefined): never {
  throw error ?? new Error("An unexpected error occurred in a GraphQL query.");
}
