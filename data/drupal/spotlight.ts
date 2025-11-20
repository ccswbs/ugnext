import { gql } from "@/lib/graphql";
import type { SpotlightPartialFragment, SpotlightHeroFragment, SpotlightCardFragment } from "@/lib/graphql/types";
import { handleGraphQLError, query } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";

export const SPOTLIGHT_HERO_FRAGMENT = gql(/* gql */ `
  fragment SpotlightHero on NodeSpotlight {
    status
    id
    rank
    title
    caption
    captionAlignment
    url {
      url
      title
    }
    image {
      image {
        alt
        url
        width
        height
        variations(styles: FOCAL_POINT600X400) {
          url
        }
      }
    }
  }
`);

export const SPOTLIGHT_CARD_FRAGMENT = gql(/* gql */ `
  fragment SpotlightCard on NodeSpotlight {
    status
    id
    rank
    title
    url {
      url
    }
    image {
      image {
        alt
        variations(styles: FOCAL_POINT600X400) {
          url
        }
      }
    }
  }
`);

export const SPOTLIGHT_PARTIAL_FRAGMENT = gql(/* gql */ `
  fragment SpotlightPartial on NodeSpotlight {
    id
    rank
  }
`);

export type SpotlightCard = {
  id: string;
  rank: number;
  title: string;
  url: string;
  image: {
    alt: string;
    url: string;
    width: number;
    height: number;
  };
};

export type SpotlightHero = SpotlightCard & {
  caption?: string;
  captionAlignment?: string;
  button: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
};

export type Spotlights = {
  hero: SpotlightHero | null;
  cards: SpotlightCard[];
};

/* This is for when we are using Playwright, to make sure it's getting static content */
function getTestSpotlights(): Spotlights {
  return {
    hero: {
      id: "4387",
      rank: 1,
      title: "Reach Your Potential ",
      caption: "Join a community dedicated to supporting your success every step of the way.",
      captionAlignment: "left",
      url: "https://www.uoguelph.ca/choose-u-of-guelph/",
      button: "Choose U of Guelph",
      image: {
        height: 1080,
        alt: "4 students on Johnston Green",
        width: 2400,
        url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-04/accept-banner.jpg",
      },
      thumbnail: {
        height: 600,
        width: 400,
        url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-04/accept-banner.jpg",
      },
    },
    cards: [
      {
        id: "3767",
        rank: 2,
        title: "Inside U of G’s Fight Against Avian Flu",
        url: "https://news.uoguelph.ca/2025/06/predict-prevent-contain-inside-u-of-gs-fight-against-avian-flu/",
        image: {
          height: 640,
          alt: "U of G scientist administers a avian flu vaccine directly into an egg. ",
          width: 1680,
          url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/uofg-avian-flu-banner-1680x640.png",
        },
      },
      {
        id: "3885",
        rank: 5,
        title: "Continuing Studies Evolves to Meet Modern Needs",
        url: "https://news.uoguelph.ca/2025/06/grad-uses-agriculture-music-and-plenty-of-pizza-to-build-community/",
        image: {
          height: 640,
          alt: "OAC grad Allison Leroux holding a freshly baked wood fire Hawaiian pizza.",
          width: 1680,
          url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/oac-allison-leroux-pizza-1680x640.jpg",
        },
      },
      {
        id: "4307",
        rank: 4,
        title: "Photo Stories of U of G Grad Students in Action",
        url: "https://graduatestudies.uoguelph.ca/grad-students-photo-stories",
        image: {
          height: 640,
          alt: "ayson Capistrano PhD Molecular & Cellular Biology working in the lab.",
          width: 1680,
          url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/jayson-capistrano-1680x640.jpg",
        },
      },
      {
        id: "4308",
        rank: 3,
        title: "A Guelph Grad, 49 Years in the Making",
        url: "https://news.uoguelph.ca/2025/06/one-course-at-a-time-a-u-of-g-degree-49-years-in-the-making/",
        image: {
          height: 640,
          alt: "Dave Burnett, an grey haired man with a beard and baseball cap posing at convocation after graduating 49 years after first starting his degree.",
          width: 1680,
          url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/uofg-dave-burnett-convocation-1680x640.jpg",
        },
      },
    ],
  };
}

async function getSpotlightIds() {
  const showUnpublished = await showUnpublishedContent();
  const seen = new Set<string>();
  const cards: SpotlightPartialFragment[] = [];
  let hero: SpotlightPartialFragment | null = null;
  const pageSize = 5;
  let page = 0;
  let total = 1;

  do {
    const { data, error } = await query({
      query: gql(/* gql */ `
        query SpotlightIDs($pageSize: Int = 5, $page: Int = 0, $status: Boolean = null) {
          spotlightRevisions(filter: { status: $status }, pageSize: $pageSize, page: $page) {
            pageInfo {
              total
            }
            results {
              __typename
              ... on NodeSpotlight {
                id
                rank
              }
            }
          }
        }
      `),
      variables: {
        page: page,
        pageSize: pageSize,
        status: showUnpublished ? null : true,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    if (!data) {
      return { hero: null, cards: [] } as Spotlights;
    }

    total = Math.ceil((data.spotlightRevisions?.pageInfo?.total ?? 0) / pageSize);

    for (const spotlight of data.spotlightRevisions?.results ?? []) {
      if (spotlight.__typename !== "NodeSpotlight") {
        continue;
      }

      if (seen.has(spotlight.id)) {
        continue;
      }

      // We found a hero spotlight
      if (!hero && spotlight.rank === 1) {
        hero = spotlight;
        seen.add(spotlight.id);
        continue;
      }

      if (cards.length < 4) {
        cards.push(spotlight);
        seen.add(spotlight.id);
      }
    }

    page++;
  } while (page < total && (cards.length < 4 || hero === null));

  return { hero, cards: cards.toSorted((a, b) => a.rank - b.rank) };
}

async function getSpotlightHeroById(id: string): Promise<SpotlightHero | null> {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query SpotlightHero($id: ID!, $revision: ID = "current") {
        nodeSpotlight(id: $id, revision: $revision) {
          ...SpotlightHero
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return null;
  }

  if (!data.nodeSpotlight) {
    return null;
  }

  return {
    id: data.nodeSpotlight.id,
    rank: data.nodeSpotlight.rank,
    title: data.nodeSpotlight.title,
    caption: data.nodeSpotlight.caption ?? undefined,
    captionAlignment: data.nodeSpotlight.captionAlignment ?? "left",
    url: data.nodeSpotlight.url.url ?? "/",
    button: data.nodeSpotlight.url.title ?? "Learn More",
    image: {
      alt: data.nodeSpotlight.image.image.alt ?? "",
      url: data.nodeSpotlight.image.image.url,
      width: data.nodeSpotlight.image.image.width,
      height: data.nodeSpotlight.image.image.height,
    },
    thumbnail: {
      url: data.nodeSpotlight.image.image.variations?.[0].url ?? "",
      width: 600,
      height: 400,
    },
  } as SpotlightHero;
}

async function getSpotlightCardById(id: string): Promise<SpotlightCard | null> {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query SpotlightCard($id: ID!, $revision: ID = "current") {
        nodeSpotlight(id: $id, revision: $revision) {
          ...SpotlightCard
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return null;
  }

  if (!data.nodeSpotlight) {
    return null;
  }

  return {
    id: data.nodeSpotlight.id,
    rank: data.nodeSpotlight.rank,
    title: data.nodeSpotlight.title,
    url: data.nodeSpotlight.url.url ?? "/",
    image: {
      alt: data.nodeSpotlight.image.image.alt ?? "",
      url: data.nodeSpotlight.image.image.variations?.[0].url ?? "",
      width: 300,
      height: 200,
    },
  };
}

export async function getSpotlights() {
  if (process.env.USE_TESTING_DATA) {
    return getTestSpotlights();
  }

  const { hero, cards } = await getSpotlightIds();

  return {
    hero: hero ? await getSpotlightHeroById(hero.id) : null,
    cards: await Promise.all(
      cards.map((card) => {
        return getSpotlightCardById(card.id);
      })
    ),
  } as Spotlights;
}
