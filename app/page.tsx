import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { getSpotlights } from "@/data/drupal/home";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { TagLine } from "@/components/home/tag-line";
import { HomeStory } from "@/components/home/story";
import { Container } from "@uoguelph/react-components/container";
import { ThreeCampuses } from "@/components/home/three-campuses";
import { Typography } from "@uoguelph/react-components/typography";
import { Rankings } from "@/components/home/rankings";
import { StudyHere } from "@/components/home/study-here";
import { twJoin } from "tailwind-merge";
import { SpotlightCards } from "@/components/home/spotlight-cards";

export default async function Page() {
  const { hero, cards } = await getSpotlights();
  const containerClasses = twJoin("pt-6");

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
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

        <HomeStory />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
