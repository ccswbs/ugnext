"use client";

import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import Image from "next/image";
import { tv } from "tailwind-variants";
import type { SpotlightCard } from "@/data/drupal/spotlight";

export const SpotlightCards = ({ cards }: { cards: SpotlightCard[] }) => {
  const classes = tv({
    slots: {
      container: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
      card: "h-full",
      image: "aspect-3/2 w-full object-cover",
      content: "flex-1",
      title: "text-[2.25rem]! font-bold text-center my-auto",
    },
  });

  const { container, card, image, content, title } = classes();

  return (
    <div className={container()}>
      {cards.map((data, index) => (
        <Card
          id={`uofg-homepage-spotlight-card-${index + 2}`}
          key={data.id}
          as={Link}
          href={data.url}
          className={`uofg-spotlight-card ${card()}`}
          centered
        >
          <CardImage
            src={data.image.url}
            alt=""
            width={`${data.image.width}`}
            height={`${data.image.height}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={image()}
            as={Image}
          />
          <CardContent className={content()}>
            <CardTitle className={title()}>{data.title}</CardTitle>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
