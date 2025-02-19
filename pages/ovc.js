import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { SpotlightCards } from "@/components/home/spotlight-cards";
import { TagLine } from "@/components/ovchome/ovc-tag-line";
import { OVCRankings } from "@/components/ovchome/ovc-rankings";
import { WorkAccreditations } from "@/components/ovchome/ovc-work-accreditations";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { HomeStory } from "@/components/home/story";
import { OVCOffers } from "@/components/ovchome/ovc-offers";
import { getSpotlightCards, getSpotlightHero } from "@/data/drupal/home";
import { twJoin } from "tailwind-merge";
import ovcLogo from "@/img/ovc/ovc_version1_full_colour.png";
import ovcEvents from "@/img/ovc/brick_leaf_contactus_background.jpg";
import Image from "next/image";
import {Button} from "@/components/button";

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
          OVC News
          </Heading>
          <SpotlightCards cards={cards} />
          <Button
          className={
            "mb-3 me-3 font-medium flex items-center justify-start gap-x-1 leading-6 md:inline-flex"
          }
          href="https://ovc.uoguelph.ca/news/"
          color="red"
          outlined="outlined"
          >
            OVC News Hub
          </Button>

        </div>

        <div className={containerClasses}>
          <Heading level={1} as={"h2"} className="font-condensed text-black">
        OVC Events
          </Heading>
          <Image 
                src={ovcEvents.src}
                width={ovcEvents?.width}
                height={ovcEvents?.height}
                alt="Ontario Veterinary College - Close-up of building covered with ivy"
                placeholder={ovcEvents?.blurred ? "blur" : "empty"}
                blurDataURL={ovcEvents?.blurred}
                />
          <Button
            className={
              "mb-3 me-3 font-medium flex items-center justify-start gap-x-1 leading-6 md:inline-flex"
            }
            href="https://ovc.uoguelph.ca/news/"
            color="red"
            outlined="outlined"
            >
              OVC Events Hub
          </Button>

          {/* <SpotlightCards cards={cards} /> */}
        </div>

        <div className={containerClasses}>
          <Heading level={1} as={"h2"} className="font-condensed text-black">
            How We Rank
          </Heading>
          <OVCRankings />
        </div>

        <div className={containerClasses}>
          {/* <Heading level={1} as={"h2"} className="font-condensed text-black">
            Our Three Campuses
          </Heading> */}
          <WorkAccreditations />
        </div>
      </Container>

      {/* <HomeStory /> */}

      <div className={containerClasses}>
        <div className={"bg-light-blue-50 grid grid-cols-3 gap-4"}>
              <div className="">
                <Image 
                src={ovcLogo.src}
                width={ovcLogo?.width}
                height={ovcLogo?.height}
                alt="Ontario Veterinary College - Main Bilding Front"
                placeholder={ovcLogo?.blurred ? "blur" : "empty"}
                blurDataURL={ovcLogo?.blurred}
                
              />
              </div>
              <div className="col-span-2 text-lg">
              The Ontario Veterinary College (OVC) at the University of Guelph is a world leader in advancing veterinary medicine and health research to improve the health of animals, people, and our planet. OVC educates the next generation of health leaders and provides high-value experiential learning opportunities through an interdisciplinary, comparative approach aimed at finding real-world solutions to real-world problems.
              <br/>
              At OVC, we are educating the next generation of health leaders, fueling discovery and providing our expertise to improve health and well-being across our world. Discover how you can contribute to the ever-evolving world of medicine, care, scientific discovery, and community.
              </div>
            </div>
        </div>

    </Layout>
  );
}
