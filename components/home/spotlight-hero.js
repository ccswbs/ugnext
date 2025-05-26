import { Hero, HeroCaption, HeroLink, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { tv } from "tailwind-variants";

export const SpotlightHero = ({ data }) => {
  const classes = tv({
    slots: {
      hero: "aspect-3/2 w-full",
      title: "mt-0!",
    },
    variants: {
      thumbnailImageCrop: {
        left: { hero: "object-left" },
        right: { hero: "object-right" },
        center: { hero: "object-center" },
      },
    },
  });

  const { hero, title } = classes({
    thumbnailImageCrop: data.thumbnailImageCrop ?? "center",
  });

  return (
    <Hero
      variant="spotlight"
      src={data.image.image.url}
      alt={data.image.image.alt}
      width={data.image.image.width}
      height={data.image.image.height}
      as={Image}
      alignment={data.captionAlignment ?? "left"}
      className={hero()}
    >
      <HeroTitle as="h2" className={title()}>
        {data.title}
      </HeroTitle>
      <HeroCaption>{data.caption}</HeroCaption>
      <HeroLink id="uofg-homepage-spotlight-hero" href={data.url.url}>
        {data.url.title}
      </HeroLink>
    </Hero>
  );
};
