"use client";

import { Card, CardImage, CardContent, CardTitle } from "@uoguelph/react-components/card";
import guelph from "@/img/guelph.png";
import ridgetown from "@/img/ridgetown.png";
import guelphHumber from "@/img/guelph-humber.png";
import { UnstyledLink } from "@/components/client/unstyled-link";
import Image from "next/image";
import { tv } from "tailwind-variants";

export const ThreeCampuses = () => {
  const classes = tv({
    slots: {
      container: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
      card: "h-full",
      image: "aspect-3/2 w-full",
      content: "flex-1",
      title: "text-[2.25rem]! font-bold text-center",
    },
  });

  const { container, card, image, content, title } = classes();

  return (
    <div className={container()}>
      <Card as={UnstyledLink} href="https://www.uoguelph.ca/admission/undergraduate/tours/" className={card()} centered>
        <CardImage
          src={guelph}
          className={image()}
          as={Image}
          alt="An aerial view of Johnston Hall and the University of Guelph campus"
        />

        <CardContent className={content()}>
          <CardTitle className={title()}>Guelph Campus</CardTitle>
        </CardContent>
      </Card>

      <Card as={UnstyledLink} href="https://www.ridgetownc.com/" className={card()} centered>
        <CardImage src={ridgetown} className={image()} as={Image} alt="An aerial view of the Ridgetown Campus" />

        <CardContent className={content()}>
          <CardTitle className={title()}>Ridgetown Campus</CardTitle>
        </CardContent>
      </Card>

      <Card as={UnstyledLink} href="https://www.guelphhumber.ca/" className={card()} centered>
        <CardImage
          src={guelphHumber}
          className={image()}
          as={Image}
          alt="The main building of the University of Guelph-Humber campus"
        />

        <CardContent className={content()}>
          <CardTitle className={title()}>Guelph-Humber Campus</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
};
