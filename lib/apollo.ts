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
import { PersistedQueryLink } from "@apollo/client/link/persisted-queries";
import type { ErrorLike } from "@apollo/client";
import { GraphQLFormattedError } from "graphql/error";
import crypto from "node:crypto";

function sha256(data: string) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

const DRUPAL_BASE_URL = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev").replace(
  /\/+(?=\?|#|$)/g,
  ""
);

function getTypename(obj: unknown, ...path: (string | number)[]) {
  let current = obj;

  for (const key of path) {
    if (current && typeof current === "object" && key in current) {
      current = current[key as keyof typeof current];
    } else {
      return null;
    }
  }

  if (current && typeof current === "object" && "__typename" in current) {
    return current["__typename"] as string | null;
  }

  return null;
}

function formatGraphQLError(data: unknown, e: GraphQLFormattedError) {
  if (!Array.isArray(e.path) || e.path.length === 0) return e.message;

  const paths: (string | number)[][] = [];

  for (let i = 1; i <= e.path.length; i++) {
    paths.push(e.path.slice(0, i));
  }

  const path: (string | number)[] = paths.map((path) => {
    const typename = getTypename(data, ...path);
    const lastIndex = path.length - 1;

    if (typename) {
      return `${path[lastIndex]} (${typename})`;
    }

    return path[lastIndex];
  });

  return `${e.message} @ ${path.join(" -> ")}`;
}

CombinedGraphQLErrors.formatMessage = (errors, options) => {
  const formatted = errors.map((e) => formatGraphQLError(options.result.data, e)).join("\n");

  return `${formatted || options.defaultFormatMessage(errors)}`;
};

const persistedQuerylink = new PersistedQueryLink({
  sha256,
});

const batchHttpLink = new BatchHttpLink({
  // this needs to be an absolute url, as relative urls cannot be used in SSR
  uri: `${DRUPAL_BASE_URL}/graphql`,
  headers: {
    "api-key": process.env.DRUPAL_API_KEY ?? "",
  },
  batchMax: 20,
  batchInterval: 50,
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: persistedQuerylink.concat(batchHttpLink),
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
