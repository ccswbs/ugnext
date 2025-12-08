"use client";

import { Hero, HeroCaption, HeroLink, type HeroProps, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { tv } from "tailwind-variants";
import type { SpotlightHero as SpotlightHeroData } from "@/data/drupal/spotlight";
import Link from "next/link";
import { useMediaQuery } from "@/lib/use-media-query";

export const SpotlightHero = ({ data }: { data: SpotlightHeroData }) => {
  const showLargeImage = /*useMediaQuery("(min-width: 768px)")*/ true;

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
      src={showLargeImage ? data.image.url : data.thumbnail.url}
      alt={data.image.alt}
      width={showLargeImage ? data.image.width : data.thumbnail.width}
      height={showLargeImage ? data.image.height : data.thumbnail.height}
      sizes="100vw"
      as={Image}
      alignment={(data.captionAlignment ?? "left") as HeroProps["alignment"]}
      className={hero()}
      preload={true}
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
