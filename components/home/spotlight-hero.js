import { Hero } from "@/components/hero";
import { twJoin } from "tailwind-merge";

export const SpotlightHero = ({ hero }) => (
  <Hero
    variant="spotlight"
    title={<h2 className="mt-0">{hero.title}</h2>}
    image={{
      src: hero.image.image.url,
      alt: hero.image.image.alt,
      width: hero.image.image.width,
      height: hero.image.image.height,
      className: twJoin(
        "aspect-[3/2] w-full",
        hero.thumbnailImageCrop === "right" && "object-right",
        hero.thumbnailImageCrop === "left" && "object-left",
        (hero.thumbnailImageCrop === "center" || !hero.thumbnailImageCrop) && "object-center"
      ),
    }}
    caption={hero.caption}
    button={{
      body: hero.url.title,
      href: hero.url.url,
    }}
    alignment={hero.captionAlignment}
  />
);
