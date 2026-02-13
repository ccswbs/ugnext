"use client";

import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { Card, CardContent, CardFooter, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo.png";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export function NewsCard({ data, className }: { data: NewsWithoutContentFragment; className?: string }) {
  let url = "";

  if (data.externallyLinked && data.externalLink) {
    url = data.externalLink.url ?? data.path ?? "";
  } else {
    url = data.path ?? "";
  }

  const newsCard = tv({
    slots: {
      card: "h-full w-full",
      image: "aspect-3/2 w-full object-cover",
    },
  });

  const { card, image } = newsCard();

  const img = data.hero?.image.variations?.[0];
  const alt = data.hero?.image.alt ?? "";

  return (
    <Card key={data.id} as={Link} href={url} className={twMerge(card(), className)}>
      <CardImage
        as={Image}
        src={img?.url ?? defaultImage.src}
        alt={alt ?? ""}
        width={`${img?.width ?? defaultImage.width}`}
        height={`${img?.height ?? defaultImage.height}`}
        className={image()}
      />

      <CardContent>
        <CardTitle>{data.title}</CardTitle>
      </CardContent>

      {data.category && data.category.length > 0 && (
        <CardFooter>{data.category?.map((category) => category.name).join(", ")}</CardFooter>
      )}
    </Card>
  );
}
