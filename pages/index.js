import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Divider } from '@/components/divider';
import { graphql } from '@/lib/drupal';
import Image from 'next/image';

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
			cards: data?.cards?.results ?? [],
			hero: data?.hero?.results?.[0] ?? null,
		},
	};
}

export default function Home({ cards, hero }) {
	return (
		<Layout title="Home">
			<Container centered>
				<Heading level={1}>UG Next Home Page</Heading>

				<Divider />
			</Container>
		</Layout>
	);
}
