import { NextDrupal } from "next-drupal";

if (!process.env.DRUPAL_CLIENT_ID) {
  throw new Error("Missing DRUPAL_CLIENT_ID: Please set the DRUPAL_CLIENT_ID environment variable.");
}

if (!process.env.DRUPAL_CLIENT_SECRET) {
  throw new Error("Missing DRUPAL_CLIENT_SECRET: Please set the DRUPAL_CLIENT_SECRET environment variable.");
}

export const Drupal = new NextDrupal(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.replace(/\/$/, "") ?? "https://api.liveugconthub.uoguelph.dev",
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID as string,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET as string,
    },
    withAuth: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
);

export const graphql = async (
  query: string,
  variables: {
    [key: string]: any;
  } = {},
  isDraftMode: boolean = false
) => {
  const endpoint = Drupal.buildUrl("/graphql").toString();

  const response = await Drupal.fetch(endpoint, {
    method: "POST",
    withAuth: true,
    body: JSON.stringify({
      query: query,
      variables: {
        status: process.env.NODE_ENV === "development" || isDraftMode ? true : null,
        ...variables,
      },
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
      .map((error: { locations: any[]; path: any[]; message: any }) => {
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
