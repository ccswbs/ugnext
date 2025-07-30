import { gql } from "@/lib/graphql";
import { SpotlightFragment } from "@/lib/graphql/types";
import { query } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";

export const SPOTLIGHT_FRAGMENT = gql(/* gql */ `
  fragment Spotlight on NodeSpotlight {
    status
    id
    rank
    title
    caption
    captionAlignment
    thumbnailImageCrop
    url {
      url
      title
    }
    image {
      ...Image
    }
  }
`);

/* This is for when we are using Playwright, to make sure it's getting static content */
function getTestSpotlights() {
  return {
    hero: {
      __typename: "NodeSpotlight",
      status: true,
      id: "4387",
      rank: 1,
      title: "Reach Your Potential ",
      caption: "Join a community dedicated to supporting your success every step of the way.",
      captionAlignment: null,
      thumbnailImageCrop: "center",
      url: {
        __typename: "Link",
        url: "https://www.uoguelph.ca/choose-u-of-guelph/",
        title: "Choose U of Guelph",
      },
      image: {
        __typename: "MediaImage",
        image: {
          __typename: "Image",
          height: 1080,
          alt: "4 students on Johnston Green",
          width: 2400,
          url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-04/accept-banner.jpg",
        },
      },
    },
    cards: [
      {
        __typename: "NodeSpotlight",
        status: true,
        id: "3767",
        rank: 2,
        title: "Inside U of G’s Fight Against Avian Flu",
        caption: null,
        captionAlignment: null,
        thumbnailImageCrop: "center",
        url: {
          __typename: "Link",
          url: "https://news.uoguelph.ca/2025/06/predict-prevent-contain-inside-u-of-gs-fight-against-avian-flu/",
          title: "Inside U of G’s Fight Against Avian Flu",
        },
        image: {
          __typename: "MediaImage",
          image: {
            __typename: "Image",
            height: 640,
            alt: "U of G scientist administers a avian flu vaccine directly into an egg. ",
            width: 1680,
            url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/uofg-avian-flu-banner-1680x640.png",
          },
        },
      },
      {
        __typename: "NodeSpotlight",
        status: true,
        id: "3885",
        rank: 5,
        title: "Continuing Studies Evolves to Meet Modern Needs",
        caption: null,
        captionAlignment: "left",
        thumbnailImageCrop: "center",
        url: {
          __typename: "Link",
          url: "https://news.uoguelph.ca/2025/06/grad-uses-agriculture-music-and-plenty-of-pizza-to-build-community/",
          title: "Pizza and Music Helps Grad Build Community",
        },
        image: {
          __typename: "MediaImage",
          image: {
            __typename: "Image",
            height: 640,
            alt: "OAC grad Allison Leroux holding a freshly baked wood fire Hawaiian pizza.",
            width: 1680,
            url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/oac-allison-leroux-pizza-1680x640.jpg",
          },
        },
      },
      {
        __typename: "NodeSpotlight",
        status: true,
        id: "4307",
        rank: 4,
        title: "Photo Stories of U of G Grad Students in Action",
        caption: null,
        captionAlignment: null,
        thumbnailImageCrop: "center",
        url: {
          __typename: "Link",
          url: "https://graduatestudies.uoguelph.ca/grad-students-photo-stories",
          title: "Photo Stories of U of G Grad Students in Action",
        },
        image: {
          __typename: "MediaImage",
          image: {
            __typename: "Image",
            height: 640,
            alt: "ayson Capistrano PhD Molecular & Cellular Biology working in the lab.",
            width: 1680,
            url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/jayson-capistrano-1680x640.jpg",
          },
        },
      },
      {
        __typename: "NodeSpotlight",
        status: true,
        id: "4308",
        rank: 3,
        title: "A Guelph Grad, 49 Years in the Making",
        caption: null,
        captionAlignment: null,
        thumbnailImageCrop: "center",
        url: {
          __typename: "Link",
          url: "https://news.uoguelph.ca/2025/06/one-course-at-a-time-a-u-of-g-degree-49-years-in-the-making/",
          title: "A Guelph Grad, 49 Years in the Making",
        },
        image: {
          __typename: "MediaImage",
          image: {
            __typename: "Image",
            height: 640,
            alt: "Dave Burnett, an grey haired man with a beard and baseball cap posing at convocation after graduating 49 years after first starting his degree.",
            width: 1680,
            url: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2025-06/uofg-dave-burnett-convocation-1680x640.jpg",
          },
        },
      },
    ],
  };
}

export type Spotlight = SpotlightFragment;

export async function getSpotlights() {
  if (process.env.USE_TESTING_DATA) {
    return getTestSpotlights();
  }

  const showUnpublished = await showUnpublishedContent();
  const seen = new Set<string>();
  const cards: Spotlight[] = [];
  let hero: Spotlight | null = null;
  const pageSize = 5;
  let page = 0;
  let total = 1;

  do {
    const { data } = await query({
      query: gql(/* gql */ `
        query Spotlights($pageSize: Int = 5, $page: Int = 0, $status: Boolean = null) {
          spotlightRevisions(filter: { status: $status }, pageSize: $pageSize, page: $page) {
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

    total = Math.ceil((data?.spotlightRevisions?.pageInfo?.total ?? 0) / pageSize);

    for (const spotlight of data?.spotlightRevisions?.results ?? []) {
      if (spotlight.__typename !== "NodeSpotlight") {
        continue;
      }

      if (seen.has(spotlight.id)) {
        continue;
      }

      if (!showUnpublished && spotlight.status === false) {
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

  return { hero, cards } as { hero: Spotlight | null; cards: Spotlight[] };
}
