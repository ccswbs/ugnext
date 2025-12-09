"use client";

import { Card, CardImage, CardContent, CardTitle } from "@uoguelph/react-components/card";
import guelph from "@/img/guelph.png";
import ridgetown from "@/img/ridgetown.png";
import guelphHumber from "@/img/guelph-humber.png";
import Link from "next/link";
import Image from "next/image";
import { tv } from "tailwind-variants";

export function ThreeCampuses() {
  const classes = tv({
    slots: {
      container: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
      card: "h-full",
      image: "aspect-3/2 w-full",
      content: "flex-1",
      title: "text-[2.25rem]! font-bold text-center m-auto",
    },
  });

  const { container, card, image, content, title } = classes();

  return (
    <div className={container()}>
      <Card as={Link} href="https://www.uoguelph.ca/admission/undergraduate/tours/" className={card()} centered>
        <CardImage
          src={guelph.src}
          width={guelph.width}
          height={guelph.height}
          blurDataURL={guelph.blurDataURL}
          className={image()}
          as={Image}
          alt=""
        />

        <CardContent className={content()}>
          <CardTitle className={title()}>Guelph Campus</CardTitle>
        </CardContent>
      </Card>

      <Card as={Link} href="https://www.ridgetownc.com/" className={card()} centered>
        <CardImage
          src={ridgetown.src}
          width={ridgetown.width}
          height={ridgetown.height}
          blurDataURL={ridgetown.blurDataURL}
          className={image()}
          as={Image}
          alt=""
        />

        <CardContent className={content()}>
          <CardTitle className={title()}>Ridgetown Campus</CardTitle>
        </CardContent>
      </Card>

      <Card as={Link} href="https://www.guelphhumber.ca/" className={card()} centered>
        <CardImage
          src={guelphHumber.src}
          width={guelphHumber.width}
          height={guelphHumber.height}
          blurDataURL={guelphHumber.blurDataURL}
          className={image()}
          as={Image}
          alt=""
        />

        <CardContent className={content()}>
          <CardTitle className={title()}>Guelph-Humber Campus</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
