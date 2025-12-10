import React from "react";
import { getSpotlights } from "@/data/drupal/spotlight";
import { twJoin } from "tailwind-merge";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { TagLine } from "@/components/client/home/tag-line";
import { SpotlightHero } from "@/components/client/home/spotlight-hero";
import { SpotlightCards } from "@/components/client/home/spotlight-cards";
import { StudyHere } from "@/components/client/home/study-here";
import { Rankings } from "@/components/client/home/rankings";
import { ThreeCampuses } from "@/components/client/home/three-campuses";
import { HomeStory } from "@/components/client/home/story";
import { getActiveStory } from "@/data/yaml/home/stories";

export default async function Page() {
  const { hero, cards } = await getSpotlights();
  const containerClasses = twJoin("pt-6");
  const story = await getActiveStory();

  return (
    <Layout>
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
          {cards && cards.length > 0 && <SpotlightCards cards={cards} />}
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

        {story && <HomeStory data={story} />}
        <div className="w-full p-5"></div>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
