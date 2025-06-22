import { onlyPublished, query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";

export async function getSpotlightHero() {
  const { data } = await query({
    query: gql(`
      query SpotlightHero($status: Boolean = null) {
        spotlightRevisions(pageSize: 1, filter: { rank: ["1"], status: $status }) {
          results {
            ... on NodeSpotlight {
              id: uuid
              caption
              captionAlignment
              thumbnailImageCrop
              title
              url {
                url
                title
              }
              image {
                ... on MediaImage {
                  image {
                    height
                    alt
                    width
                    url
                  }
                }
              }
            }
          }
        }
      }
    `),
    variables: {
      status: await onlyPublished(),
    },
  });

  return data?.spotlightRevisions?.results?.[0];
}

/*
export const getSpotlightCards = async (status: boolean, hero) => {
  /*const ids = new Set();
  let isLastPage = false;
  let page = 0;

  outer: while (!isLastPage) {
    const cards = (
      await graphql(spotlightCardIDsQuery, {
        status: status,
        page: page,
      })
    )?.data?.spotlightRevisions?.results;

    for (const card of cards) {
      if (card.id === hero.id) {
        continue;
      }

      if (ids.size === 4) {
        break outer;
      }

      ids.add(card.id);
    }

    // The page wasn't full, meaning we were on the last page.
    if (cards.length < 5) {
      isLastPage = true;
    }

    page++;
  }

  // Now that we have the ids, we can retrieve the content.
  const cards = await Promise.all(
    Array.from(ids).map(async (id) => {
      const { data } = await graphql(spotlightCardQuery, {
        status: status,
        id: id,
      });

      const card = data.spotlightRevisions.results?.[0];

      if (!card) {
        throw new Error(`Failed to fetch spotlight card ${id} data.`);
      }

      // The image is an array of variations, so we need to find the one that matches the thumbnailImageCrop.
      const image =
        card.image?.image?.variations?.find((variation) => {
          return variation.name.toLowerCase().includes(card.thumbnailImageCrop);
        }) ?? {};

      return {
        id: id,
        ...card,
        image: {
          alt: card.image.image.alt,
          ...image,
        },
      };
    })
  );

  return cards?.sort((a, b) => a.rank - b.rank) ?? [];


};
*/
