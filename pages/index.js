import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { SpotlightCards } from "@/components/home/spotlight-cards";
import { TagLine } from "@/components/home/tag-line";
import { Rankings } from "@/components/home/rankings";
import { ThreeCampuses } from "@/components/home/three-campuses";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { HomeStory } from "@/components/home/story";
import { StudyHere } from "@/components/home/study-here";
import { getSpotlightCards, getSpotlightHero } from "@/data/drupal/home";
import { twJoin } from "tailwind-merge";
import AppArmor from "@/components/app-armor";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;
  const hero = await getSpotlightHero(status);
  const cards = await getSpotlightCards(status, hero);

  return {
    props: {
      cards: cards,
      hero: hero,
    },
  };
}

export function HomePage({ cards, hero, loading, appArmorTest = false }) {
  const containerClasses = twJoin("pt-6");

  return (
    <>
      <AppArmor test={appArmorTest} />

      <Header></Header>

      <Layout>
        <LayoutContent container={false}>
          <div className="flex flex-col-reverse">
            <TagLine />
            {hero && <SpotlightHero data={hero} />}
          </div>

          <Container>
            <Typography className="text-black!" type="h2" as="h2">
              Our Latest News and Events
            </Typography>
            <SpotlightCards cards={cards} />
          </Container>

          <Container className={containerClasses}>
            <Typography className="text-black!" type="h2" as="h2">
              Study Here
            </Typography>
            <StudyHere />
          </Container>

          <Container className={containerClasses}>
            <Typography className="text-black!" type="h2" as="h2">
              How We Rank Among the World
            </Typography>
            <Rankings />
          </Container>

          <Container className={containerClasses}>
            <Typography className="text-black!" type="h2" as="h2">
              Our Three Campuses
            </Typography>
            <ThreeCampuses />
          </Container>

          <HomeStory />
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}

export default function Home({ cards, hero }) {
  return <HomePage cards={cards} hero={hero} />;
}
