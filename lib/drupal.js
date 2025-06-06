import { DrupalClient } from "next-drupal";

export const Drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.replace(/\/$/, "") ?? "https://api.liveugconthub.uoguelph.dev",
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
  }
);

export const graphql = async (query, variables) => {
  if (!Drupal) {
    return null;
  }

  const endpoint = Drupal.buildUrl("/graphql").toString();

  const response = await Drupal.fetch(endpoint, {
    method: "POST",
    withAuth: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Failed to fetch graphql data from ${endpoint}\nServer responded: ${response.status} ${response.statusText}. ${body}`
    );
  }

  const body = await response.json();

  if (Array.isArray(body.errors) && body.errors.length > 0) {
    const errorMsg = body.errors
      .map((error) => {
        const locations =
          error.locations
            ?.map((location) => {
              return `line: ${location.line}, column: ${location.column}`;
            })
            ?.join(", ") ?? "";

        const path = error.path?.join(" -> ") ?? "";

        return `${error.message} @ ${locations}\n  path: ${path}\n`;
      })
      .join("\n");

    const err = new Error(`Failed to fetch graphql data from ${endpoint}\n  Server responded: ${errorMsg}`);

    err.stack = "";

    throw err;
  }

  return body;
};
