"use client";

import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { Card, CardContent, CardFooter, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo.png";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Typography } from "@uoguelph/react-components/typography";

export function NewsCard({
  data,
  variant = "row",
  className,
}: {
  data: NewsWithoutContentFragment;
  variant?: "grid" | "row";
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
      card: "w-full",
      image: "aspect-3/2 w-full object-cover",
      content: "",
      title: "",
      categories: "",
    },
    variants: {
      variant: {
        grid: {
          card: "h-full",
        },
        row: {
          card: "flex h-40 flex-col sm:flex-row items-center justify-center transition-colors bg-grey-light-bg hover:bg-grey-light",
          content: "light flex flex-1 h-full flex-col gap-4 justify-center p-4",
          image: "w-auto h-full object-cover",
          title: "m-0",
          categories: "text-lg m-0",
        },
      },
    },
  });

  const { card, image, content, title, categories } = newsCard({ variant });

  const img = data.hero?.image.variations?.[0];
  const alt = data.hero?.image.alt ?? "";

  if (variant === "row") {
    return (
      <Link key={data.id} href={url} className={twMerge(card(), className)}>
        <Image
          src={img?.url ?? defaultImage.src}
          alt={alt ?? ""}
          width={`${img?.width ?? defaultImage.width}`}
          height={`${img?.height ?? defaultImage.height}`}
          className={image()}
        />

        <div className={content()}>
          <Typography as="span" type="h3" className="font-bold m-0">
            {data.title}
          </Typography>

          {data.category && data.category.length > 0 && (
            <Typography as="span" type="body" className="text-lg m-0">
              {data.category?.map((category) => category.name).join(", ")}
            </Typography>
          )}
        </div>
      </Link>
    );
  }

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
