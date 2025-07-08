import { getSpotlightCards, getSpotlightHero } from "@/data/drupal/home";
import { twJoin } from "tailwind-merge";
import { Meta, AIO } from "@/components/meta";
import AppArmor from "@/components/app-armor";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { TagLine } from "@/components/home/tag-line";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { SpotlightCards } from "@/components/home/spotlight-cards";
import { StudyHere } from "@/components/home/study-here";
import { Rankings } from "@/components/home/rankings";
import { ThreeCampuses } from "@/components/home/three-campuses";
import { HomeStory } from "@/components/home/story";
import { Footer } from "@uoguelph/react-components/footer";
import { useRouter } from "next/router";

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

export default function Home({ cards, hero }) {
  const containerClasses = twJoin("pt-6");
  const { query } = useRouter();

  return (
    <Layout>
      <Meta></Meta>
      <AIO></AIO>

      <AppArmor test={query["ens-test"] === "true"} />

      <Header></Header>

      <LayoutContent container={false} className="pb-0!">
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
        <div className="w-full p-5"></div>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
