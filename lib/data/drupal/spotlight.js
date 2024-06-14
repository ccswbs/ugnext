import { graphql } from '@/lib/drupal';

export const getSpotlightHero = async (preview) => {
	// Look through the latest revisions of spotlight items, filtered to only those that are rank 1 (and published if not in preview mode).
	return (
		await graphql(
			`
				query SpotlightHero($status: Boolean = null) {
					spotlightRevisions(pageSize: 1, filter: { rank: ["1"], status: $status }) {
						results {
							... on NodeSpotlight {
								id
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
											variations(styles: SPOTLIGHT_HERO_IMAGE) {
												url
											}
										}
									}
								}
							}
						}
					}
				}
			`,
			{
				status: preview,
			},
		)
	)?.data?.spotlightRevisions?.results?.[0];
};

export const getSpotlightCards = async (preview, ignore) => {
	// For spotlight cards our query is a bit more involved. We look through the latest revisions (5 at once this time) like we did for the hero, but because we need 4 cards, and a single spotlight can have many revisions, we keep track of the ids of the spotlights we've seen and keep requesting more until we have 4 unique ids. With those ids. we can request the content separately.

	const ids = new Set();
	let isLastPage = false;
	let page = 0;

	outer: while (!isLastPage) {
		const cards = (
			await graphql(
				`
					query SpotlightCardIDs($status: Boolean = null, $page: Int = 0) {
						spotlightRevisions(filter: { rank: [], status: $status }, page: $page, pageSize: 5) {
							results {
								... on NodeSpotlight {
									id
								}
							}
						}
					}
				`,
				{
					status: preview,
					page: page,
				},
			)
		)?.data?.spotlightRevisions?.results;

		for (const card of cards) {
			if (card.id === ignore) {
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
			const { data } = await graphql(
				`
					query SpotlightCard($status: Boolean = false, $id: String = "") {
						spotlightRevisions(filter: { status: $status, id: $id }, pageSize: 1) {
							results {
								... on NodeSpotlight {
									image {
										... on MediaImage {
											image {
												alt
												height
												width
												variations(styles: SPOTLIGHT_CARD_IMAGE) {
													url
												}
											}
										}
									}
									rank
									title
									thumbnailImageCrop
									url {
										url
										title
									}
								}
							}
						}
					}
				`,
				{
					status: preview,
					id: id,
				},
			);

			return {
				id: id,
				...(data.spotlightRevisions.results?.[0] ?? {}),
			};
		}),
	);

	return cards.sort((a, b) => a.rank - b.rank);
};
