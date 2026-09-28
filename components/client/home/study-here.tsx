"use client";

import {
  LinkCarousel,
  LinkCarouselLinks,
  LinkCarouselLink,
  LinkCarouselContent,
  LinkCarouselItem,
} from "@uoguelph/react-components/link-carousel";
import undergraduate from "@/img/home/undergraduate.jpg";
import graduate from "@/img/home/graduate.jpg";
import international from "@/img/home/international.jpg";
import lifelong from "@/img/home/continuing-education.jpg";
import Image from "next/image";
import { tv } from "tailwind-variants";

export function StudyHere() {
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
        <LinkCarouselLink href="https://www.uoguelph.ca/international/" id="international" className={link()}>
          International Students
        </LinkCarouselLink>
        <LinkCarouselLink href="https://www.uoguelph.ca/continuing-studies/" id="lifelong-learning" className={link()}>
          Continuing Studies
        </LinkCarouselLink>
      </LinkCarouselLinks>
      <LinkCarouselContent>
        <LinkCarouselItem id="undergraduate-programs" className={item()}>
          <Image className={image()} src={undergraduate} alt="" />
          {/*<span className={caption()}>Leah Weller - Environmental Engineering</span>*/}
        </LinkCarouselItem>
        <LinkCarouselItem id="graduate-programs" className={item()}>
          <Image className={image()} src={graduate} alt="" />
          {/*<span className={caption()}>Leah Weller - Environmental Engineering</span>*/}
        </LinkCarouselItem>
        <LinkCarouselItem id="international" className={item()}>
          <Image className={image()} src={international} alt="" />
          {/*<span className={caption()}>Leah Weller - Environmental Engineering</span>*/}
        </LinkCarouselItem>
        <LinkCarouselItem id="lifelong-learning" className={item()}>
          <Image className={image()} src={lifelong} alt="" />
          {/*<span className={caption()}>Leah Weller - Environmental Engineering</span>*/}
        </LinkCarouselItem>
      </LinkCarouselContent>
    </LinkCarousel>
  );
}
