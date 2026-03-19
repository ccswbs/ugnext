"use client";

import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { Card, CardContent, CardFooter, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo.png";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Typography } from "@uoguelph/react-components/typography";
import { Info } from "@uoguelph/react-components/info";

export function NewsCard({
  data,
  variant = "vertical",
  hideCategory = false,
  className,
}: {
  data: NewsWithoutContentFragment;
  variant?: "spotlight" | "vertical" | "horizontal" | "no-image";
  hideCategory?: boolean;
  className?: string;
}) {
  let url = "";

  if (data.externallyLinked && data.externalLink) {
    url = data.externalLink.url ?? data.path ?? "";
  } else {
    url = data.path ?? "";
  }

  const newsCard = tv({
    slots: {
      card: "w-full flex flex-col gap-3  transition-colors group",
      imageContainer: "overflow-hidden w-full",
      image: "aspect-video w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-110",
      content: "w-full flex-col flex gap-3",
      title:
        "font-bold m-0 underline decoration-transparent group-hover:decoration-black transition-colors group-focus:underline",
      category: "text-lg m-0 uppercase",
    },
    variants: {
      variant: {
        spotlight: {
          card: "",
        },
        vertical: {
          card: "",
          image: "",
          title: "",
          category: "",
        },
        horizontal: {
          card: "flex-row items-center gap-4 ",
          content: "w-1/2",
          imageContainer: "w-1/2",
          title: "block ",
        },
        "no-image": {},
      },
    },
  });

  const { card, imageContainer, image, content, title, category } = newsCard({ variant });

  const img = data.hero?.image.variations?.[0];
  const alt = data.hero?.image.alt ?? "";

  return (
    <Link key={data.id} href={url} className={twMerge(card(), className)}>
      {variant !== "no-image" && (
        <div className={imageContainer()}>
          <Image
            src={img?.url ?? defaultImage.src}
            alt={alt ?? ""}
            width={`${img?.width ?? defaultImage.width}`}
            height={`${img?.height ?? defaultImage.height}`}
            className={image()}
          />
        </div>
      )}

      <div className={content()}>
        {data.category && data.category.length > 0 && !hideCategory && (
          <Typography as="span" type="body" className={category()}>
            {data.category[0].name}
          </Typography>
        )}

        <Typography as="span" type="h4" className={title()}>
          {data.title}
        </Typography>
      </div>

      {data.leadParagraph && variant === "spotlight" && <Info color="yellow">{data.leadParagraph}</Info>}
    </Link>
  );
}
