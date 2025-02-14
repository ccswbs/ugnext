import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { SpotlightCards } from "@/components/home/spotlight-cards";
import { TagLine } from "@/components/ovchome/ovc-tag-line";
import { Rankings } from "@/components/home/rankings";
import { WorkAccreditations } from "@/components/ovchome/ovc-work-accreditations";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { HomeStory } from "@/components/home/story";
import { OVCOffers } from "@/components/ovchome/ovc-offers";
import { getSpotlightCards, getSpotlightHero } from "@/data/drupal/home";
import { twJoin } from "tailwind-merge";

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

export default function OVCHome({ cards, hero }) {
  const containerClasses = twJoin("pt-6");

  return (
    <Layout>
      <h1 className="sr-only">Ontario Veterinary College</h1>
      <h2 className="sr-only">University of Guelph, Ontario, Canada</h2>

      {hero && <SpotlightHero hero={hero} />}

      <Container centered>
        <TagLine />
        <Heading level={1} as={"h2"} className="font-condensed text-black">
        Improve Life Improve Life With Us
      </Heading>
        <div className={containerClasses}>
          <OVCOffers />
        </div>

        <div className={containerClasses}>
          <Heading level={1} as={"h2"} className="font-condensed text-black">
          Latest OVC News and Events
          </Heading>
          <SpotlightCards cards={cards} />
        </div>

        <div className={containerClasses}>
          <Heading level={1} as={"h2"} className="font-condensed text-black">
            How We Rank
          </Heading>
          <Rankings />
        </div>

        <div className={containerClasses}>
          {/* <Heading level={1} as={"h2"} className="font-condensed text-black">
            Our Three Campuses
          </Heading> */}
          <WorkAccreditations />
        </div>
      </Container>

      {/* <HomeStory /> */}
    </Layout>
  );
}
