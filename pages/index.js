import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { graphql } from '@/lib/drupal';
import { SpotlightCards } from '@/components/home/spotlight-cards';
import { TagLine } from '@/components/home/tag-line';
import { Rankings } from '@/components/home/rankings';
import { ThreeCampuses } from '@/components/home/three-campuses';
import { SpotlightHero } from '@/components/home/spotlight-hero';
import { HomeStory } from '@/components/home/story';
import { StudyHere } from '@/components/home/study-here';

export async function getStaticProps(context) {
	const isPreview = context?.preview || process.env.NODE_ENV !== 'production';
	const status = isPreview ? null : true;

	// Look through the latest revisions of spotlight items, filtered to only those that are rank 1 (and published if not in preview mode).
	const hero = (
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
				status: status,
			},
		)
	)?.data?.spotlightRevisions?.results?.[0];

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
					status: status,
					page: page,
				},
			)
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
					status: status,
					id: id,
				},
			);

			return {
				id: id,
				...(data.spotlightRevisions.results?.[0] ?? {}),
			};
		}),
	);

	return {
		props: {
			cards: cards.sort((a, b) => a.rank - b.rank),
			hero: hero,
		},
	};
}

export default function Home({ cards, hero }) {
	return (
		<Layout title="Home">
			{hero && <SpotlightHero hero={hero} />}

			<Container centered>
				<TagLine />

				<div className="pt-1">
					<Heading level={2}>Our Latest News and Events</Heading>
					<SpotlightCards cards={cards} />
				</div>

				<div className="pt-1">
					<Heading level={2}>Study Here</Heading>
					<StudyHere />
				</div>

				<div className="pt-1">
					<Heading level={2}>How We Rank Among the World</Heading>
					<Rankings />
				</div>

				<div className="pt-1">
					<Heading level={2}>Our Three Campuses</Heading>
					<ThreeCampuses />
				</div>
			</Container>

			<HomeStory />
		</Layout>
	);
}
