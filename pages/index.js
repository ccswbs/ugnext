import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Divider } from '@/components/divider';
import { graphql } from '@/lib/drupal';

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
								id
								name
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
								id
								name
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
			data: data,
		},
	};
}

export default function Home(data) {
	console.log(data);

	return (
		<Layout title="Home">
			<Container centered>
				<Heading level={1}>UG Next Home Page</Heading>

				<Divider />
			</Container>
		</Layout>
	);
}
