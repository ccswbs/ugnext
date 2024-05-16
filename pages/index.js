import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { graphql } from '@/lib/drupal';
import { SpotlightCards } from '@/components/home/spotlight-cards';
import { TagLine } from '@/components/home/tag-line';
import { Rankings } from '@/components/home/rankings';
import { ThreeCampuses } from '@/components/home/three-campuses';
import { Hero } from '@/components/hero';

export async function getStaticProps() {
	const { data } = await graphql(`
		query {
			hero: spotlightHero {
				results {
					... on NodeSpotlight {
						title
						thumbnailImageCropping
						caption
						captionAlignment
						image {
							... on MediaImage {
								image {
									width
									url
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
									height
									alt
								}
							}
						}
						url {
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
	return (
		<Layout title="Home">
			<Hero
				title={hero.title}
				caption={hero.caption}
				href={hero.url.url}
				button={hero.url.title}
				src={hero.image.image.url}
				alt={hero.image.image.alt}
				height={hero.image.image.height}
				width={hero.image.image.width}
				crop={hero.thumbnailImageCropping}
				alignment={hero.captionAlignment}
			/>

			<Container centered>
				<TagLine />

				<div className="pt-1">
					<Heading level={2}>Our Latest News and Events</Heading>
					<SpotlightCards cards={cards} />
				</div>

				<div className="pt-1">
					<Heading level={2}>Study Here</Heading>
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
		</Layout>
	);
}
