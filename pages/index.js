import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { graphql } from '@/lib/drupal';
import { SpotlightCards } from '@/components/home/spotlight-cards';
import { TagLine } from '@/components/home/tag-line';

export async function getStaticProps() {
	const { data } = await graphql(`
		query {
			hero: spotlightHero {
				results {
					... on NodeSpotlight {
						title
						caption
						captionAlignment
						image {
							... on MediaImage {
								image {
									width
									url
									title
									mime
									height
									alt
								}
							}
						}
						url {
							title
							url
						}
					}
				}
			}
			cards: spotlightCards {
				results {
					... on NodeSpotlight {
						id
						title
						thumbnailImageCropping
						rank
						image {
							... on MediaImage {
								image {
									width
									url
									title
									mime
									height
									alt
								}
							}
						}
						url {
							title
							url
						}
					}
				}
			}
		}
	`);

	return {
		props: {
			cards: data?.cards?.results?.slice(0, 4) ?? [],
			hero: data?.hero?.results?.[0] ?? null,
		},
	};
}

export default function Home({ cards, hero }) {
	console.log(cards);
	return (
		<Layout title="Home">
			<Container centered>
				<TagLine />

				<div className="pt-2">
					<Heading level={2}>Our Latest News and Events</Heading>
					<SpotlightCards cards={cards} />
				</div>
			</Container>
		</Layout>
	);
}
