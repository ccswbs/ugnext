import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { SpotlightCards } from '@/components/home/spotlight-cards';
import { TagLine } from '@/components/home/tag-line';
import { Rankings } from '@/components/home/rankings';
import { ThreeCampuses } from '@/components/home/three-campuses';
import { SpotlightHero } from '@/components/home/spotlight-hero';
import { HomeStory } from '@/components/home/story';
import { StudyHere } from '@/components/home/study-here';
import { getSpotlightCards, getSpotlightHero } from '@/data/drupal/home';

export async function getStaticProps(context) {
	const status = context?.preview || process.env.NODE_ENV !== 'production' ? null : true;
	const hero = await getSpotlightHero(status);
	const cards = await getSpotlightCards(status, hero);

	return {
		props: {
			cards: cards,
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
					<Heading level={1} as={'h2'} className="font-condensed text-black">
						Our Latest News and Events
					</Heading>
					<SpotlightCards cards={cards} />
				</div>

				<div className="pt-1">
					<Heading level={1} as={'h2'} className="font-condensed text-black">
						Study Here
					</Heading>
					<StudyHere />
				</div>

				<div className="pt-1">
					<Heading level={1} as={'h2'} className="font-condensed text-black">
						How We Rank Among the World
					</Heading>
					<Rankings />
				</div>

				<div className="pt-1">
					<Heading level={1} as={'h2'} className="font-condensed text-black">
						Our Three Campuses
					</Heading>
					<ThreeCampuses />
				</div>
			</Container>

			<HomeStory />
		</Layout>
	);
}
