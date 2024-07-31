import { graphql } from '@/lib/drupal';
import spotlightHeroQuery from './spotlight-hero.graphql';
import spotlightCardIDsQuery from './spotlight-card-ids.graphql';
import spotlightCardQuery from './spotlight-card.graphql';

export const getSpotlightHero = async (status) => {
	const { data } = await graphql(spotlightHeroQuery, {
		status: status,
	});

	return data?.spotlightRevisions?.results?.[0];
};

export const getSpotlightCards = async (status, hero) => {
	const ids = new Set();
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

			return {
				id: id,
				...(data.spotlightRevisions.results?.[0] ?? {}),
			};
		}),
	);

	return cards?.sort((a, b) => a.rank - b.rank) ?? [];
};
