import { CombinedGraphQLErrors, HttpLink, ServerError } from "@apollo/client";
import { registerApolloClient, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { PersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { RetryLink } from "@apollo/client/link/retry";
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

function parseIntEnv(value: string | undefined, fallback: number) {
  const parsed = parseInt(value ?? "");
  return isNaN(parsed) ? fallback : parsed;
}

// Status codes that indicate a transient upstream problem worth retrying (e.g. Pantheon 502 networking failures).
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

function isRetryableError(error: ErrorLike) {
  // GraphQL errors are returned with a successful response and won't succeed on retry.
  if (CombinedGraphQLErrors.is(error)) return false;

  if (ServerError.is(error)) {
    return RETRYABLE_STATUS_CODES.has(error.statusCode);
  }

  // Anything else is a network level failure (connection reset, DNS, timeout, etc.).
  return true;
}

// Retries failed requests with exponential backoff and jitter so a transient upstream failure
// doesn't fail an entire build or request.
const retryLink = new RetryLink({
  delay: {
    initial: parseIntEnv(process.env.GRAPHQL_RETRY_INITIAL_DELAY, 500),
    max: parseIntEnv(process.env.GRAPHQL_RETRY_MAX_DELAY, 10000),
    jitter: true,
  },
  attempts: {
    max: parseIntEnv(process.env.GRAPHQL_RETRY_MAX_ATTEMPTS, 5),
    retryIf: (error, operation) => {
      const retryable = isRetryableError(error);

      if (retryable) {
        const status = ServerError.is(error) ? ` (status ${error.statusCode})` : "";
        console.warn(`GraphQL Warning: retrying ${operation.operationName ?? "operation"}${status}: ${error.message}`);
      }

      return retryable;
    },
  },
});

const httpLink = new HttpLink({
  // this needs to be an absolute url, as relative urls cannot be used in SSR
  uri: `${DRUPAL_BASE_URL}/graphql`,
  headers: {
    "api-key": process.env.DRUPAL_API_KEY ?? "",
  },
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: retryLink.concat(persistedQuerylink).concat(httpLink),
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      watchQuery: {
        errorPolicy: "all",
      },
      mutate: {
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
