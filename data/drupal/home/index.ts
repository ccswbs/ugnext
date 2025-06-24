import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { DraftSpotlightsQuery, PublishedSpotlightsQuery } from "@/lib/graphql/types";

async function getDraftSpotlights() {
  type Spotlight = Extract<
    NonNullable<DraftSpotlightsQuery["latestContentRevisions"]>["results"][number],
    { __typename?: "NodeSpotlight" }
  >;

  const cards: Spotlight[] = [];
  let hero: Spotlight | null = null;
  const pageSize = 5;
  let page = 0;
  let total = 1;

  do {
    const { data } = await query({
      query: gql(/* gql */ `
        query DraftSpotlights($pageSize: Int = 5, $page: Int = 0) {
          latestContentRevisions(filter: { type: "spotlight" }, pageSize: $pageSize, page: $page) {
            pageInfo {
              total
            }
            results {
              __typename
              ...Spotlight
            }
          }
        }
      `),
      variables: {
        page: page,
        pageSize: pageSize,
      },
    });

    total = Math.ceil((data?.latestContentRevisions?.pageInfo?.total ?? 0) / pageSize);

    for (const spotlight of data?.latestContentRevisions?.results ?? []) {
      if (spotlight.__typename === "NodeSpotlight") {
        // We found a hero spotlight
        if (!hero && spotlight.rank === 1) {
          hero = spotlight;
          continue;
        }

        if (cards.length < 4) {
          cards.push(spotlight);
        }
      }
    }

    page++;
  } while (page < total && (cards.length < 4 || hero === null));

  return { hero, cards };
}

async function getPublishedSpotlights() {
  type Spotlight = NonNullable<PublishedSpotlightsQuery["nodeSpotlights"]>["nodes"][number];

  const cards: Spotlight[] = [];
  let hero: Spotlight | null = null;
  const pageSize = 5;
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage && (cards.length < 4 || hero === null)) {
    const { data } = await query({
      query: gql(/* gql */ `
        query PublishedSpotlights($cursor: Cursor = null, $pageSize: Int = 5) {
          nodeSpotlights(first: $pageSize, after: $cursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              ...Spotlight
            }
          }
        }
      `),
      variables: {
        cursor: cursor,
        pageSize: pageSize,
      },
    });

    for (const spotlight of data?.nodeSpotlights?.nodes ?? []) {
      if (spotlight.__typename === "NodeSpotlight") {
        // Ignore unpublished content
        if (spotlight.status === false) continue;

        // We found a hero spotlight
        if (!hero && spotlight.rank === 1) {
          hero = spotlight;
          continue;
        }

        if (cards.length < 4) {
          cards.push(spotlight);
        }
      }
    }

    hasNextPage = data?.nodeSpotlights?.pageInfo?.hasNextPage ?? false;
  }

  console.log(cards);

  return { hero, cards: cards as Spotlight[] };
}

export async function getSpotlights() {
  // Preview
  if (await showUnpublishedContent()) {
    return await getDraftSpotlights();
  }

  return await getPublishedSpotlights();
}
