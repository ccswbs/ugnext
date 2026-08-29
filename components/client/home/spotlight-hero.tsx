"use client";

import { Hero, HeroCaption, HeroLink, type HeroProps, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { tv } from "tailwind-variants";
import type { SpotlightHero as SpotlightHeroData } from "@/data/drupal/spotlight";
import { LazyLink as Link } from "@/components/client/widgets/lazy-link";

export const SpotlightHero = ({ data }: { data: SpotlightHeroData }) => {
  const classes = tv({
    slots: {
      hero: "w-full [&_.uofg-hero-img]:object-cover",
      title: "mt-0 font-sans",
    },
  });

  const { hero, title } = classes();

  return (
    <Hero
      variant="spotlight"
      src={data.image.url}
      alt={data.image.alt}
      width={data.image.width}
      height={data.image.height}
      sizes="100vw"
      as={Image}
      priority
      alignment={(data.captionAlignment ?? "left") as HeroProps["alignment"]}
      className={hero()}
    >
      <HeroTitle as="h2" className={title()}>
        {data.title}
      </HeroTitle>
      <HeroCaption>{data.caption}</HeroCaption>
      {/* @ts-ignore */}
      <HeroLink id="uofg-homepage-spotlight-hero" href={data.url} as={Link}>
        {data.button}
      </HeroLink>
    </Hero>
  );
};
