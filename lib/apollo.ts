import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  LocalStateError,
  ServerError,
  ServerParseError,
  UnconventionalError,
} from "@apollo/client";
import { registerApolloClient, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import type { ErrorLike } from "@apollo/client";

const DRUPAL_BASE_URL = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev").replace(
  /\/+(?=\?|#|$)/g,
  ""
);

CombinedGraphQLErrors.formatMessage = (errors, options) => {
  const formatted = errors
    .map((e) => {
      const path = Array.isArray(e.path) && e.path.length ? ` @ ${e.path.join(" -> ")}` : "";
      const code = e.extensions?.code ? ` [code: ${String(e.extensions.code)}]` : "";
      return `${e.message}${path}${code}`;
    })
    .join("\n");

  return `${formatted || options.defaultFormatMessage(errors)}`;
};

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
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
    },
  });
});

export async function onlyPublished() {
  return (await showUnpublishedContent()) ? null : true;
}

export function handleGraphQLError(error: ErrorLike | undefined): never {
  if (!error) {
    throw new Error("An unexpected error occurred in a GraphQL query.");
  }

  throw error;
}
