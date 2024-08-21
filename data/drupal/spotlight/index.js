import { graphql } from '@/lib/drupal';
import getSpotlightHeroQuery from './get-spotlight-hero.graphql';
import getSpotlightCardIDsQuery from './get-spotlight-card-ids.graphql';
import getSpotlightCardQuery from './get-spotlight-card.graphql';

export const getSpotlightHero = async (status) => {
  // Look through the latest revisions of spotlight items, filtered to only those that are rank 1 (and published if not in preview mode).
  return (await graphql(getSpotlightHeroQuery, { status: status }))?.data?.spotlightRevisions?.results?.[0];
};

export const getSpotlightCards = async (status, hero) => {
  // For spotlight cards, our query is a bit more involved. We look through the latest revisions (5 at once this time) like we did for the hero, but because we need 4 cards, and a single spotlight can have many revisions, we keep track of the ids of the spotlights we've seen and keep requesting more until we have 4 unique ids. With those ids. We can request the content separately.
  const ids = new Set();
  let isLastPage = false;
  let page = 0;

  outer: while (!isLastPage) {
    const cards = (
      await graphql(getSpotlightCardIDsQuery, {
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

  const cards = await Promise.all(
    Array.from(ids).map(async (id) => {
      const { data } = await graphql(getSpotlightCardQuery, {
        status: status,
        id: id,
      });

      return {
        id: id,
        ...(data.spotlightRevisions.results?.[0] ?? {}),
      };
    }),
  );

  return cards.sort((a, b) => a.rank - b.rank);
};
