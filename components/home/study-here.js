import {
  LinkCarousel,
  LinkCarouselLinks,
  LinkCarouselLink,
  LinkCarouselContent,
  LinkCarouselItem,
} from "@uoguelph/react-components/link-carousel";
import undergraduate from "@/img/leah-weller-environmental-engineering-u-of-g.jpg";
import graduate from "@/img/caroline-pottruff-landscape-architecture-u-of-g.jpg";
import international from "@/img/ryan-ahlers-theatre-studies-u-of-g.jpg";
import lifelong from "@/img/kathryn-knowles-jenna-schamowski-environmental-sciences-u-of-g.jpg";
import Image from "next/image";
import { tv } from "tailwind-variants";

export const StudyHere = () => {
  const classes = tv({
    slots: {
      link: "text-xl",
      item: "",
      image: "h-96",
      caption:
        "absolute bottom-0 left-0 z-10 text-white bg-linear-to-t from-black to-transparent p-4 pt-6 text-lg w-full",
    },
  });

  const { link, item, image, caption } = classes();

  return (
    <LinkCarousel direction="right" stack>
      <LinkCarouselLinks>
        <LinkCarouselLink href="https://admission.uoguelph.ca/programs" id="undergraduate-programs" className={link()}>
          Undergraduate Programs
        </LinkCarouselLink>
        <LinkCarouselLink href="https://graduatestudies.uoguelph.ca/" id="graduate-programs" className={link()}>
          Graduate Programs
        </LinkCarouselLink>
        <LinkCarouselLink href="https://www.uoguelph.ca/study-in-canada/" id="international" className={link()}>
          International
        </LinkCarouselLink>
        <LinkCarouselLink href="https://www.uoguelph.ca/continuing-studies/" id="lifelong-learning" className={link()}>
          Continuing Studies
        </LinkCarouselLink>
      </LinkCarouselLinks>
      <LinkCarouselContent>
        <LinkCarouselItem id="undergraduate-programs" className={item()}>
          <Image
            className={image()}
            src={undergraduate}
            alt="Leah Weller and another student in lab coats looking at a computer screen."
          />
          <span className={caption()}>Leah Weller - Environmental Engineering</span>
        </LinkCarouselItem>
        <LinkCarouselItem id="graduate-programs" className={item()}>
          <Image className={image()} src={graduate} alt="Caroline Pottruff working in a forest with a hard hat on" />
          <span className={caption()}>Caroline Pottruff - Landscape Architecture</span>
        </LinkCarouselItem>
        <LinkCarouselItem id="international" className={item()}>
          <Image className={image()} src={international} alt="Ryan Ahlers adjusting a spotlight in a theatre" />
          <span className={caption()}>Ryan Ahlers - Theatre Studies</span>
        </LinkCarouselItem>
        <LinkCarouselItem id="lifelong-learning" className={item()}>
          <Image className={image()} src={lifelong} alt="Kathryn Knowles & Jenna Schamowski working with bee hives." />
          <span className={caption()}>Kathryn Knowles & Jenna Schamowski - Environmental Sciences</span>
        </LinkCarouselItem>
      </LinkCarouselContent>
    </LinkCarousel>
  );
};
