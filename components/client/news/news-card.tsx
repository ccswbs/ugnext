"use client";

import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { Card, CardContent, CardFooter, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo.png";

export function NewsCard({ data }: { data: NewsWithoutContentFragment }) {
  let url = "";

  if (data.externallyLinked && data.externalLink) {
    url = data.externalLink.url ?? data.path ?? "";
  } else {
    url = data.path ?? "";
  }

  return (
    <Card key={data.id} as={Link} href={url}>
      <CardImage
        as={Image}
        src={data.hero?.image.variations?.[0]?.url ?? defaultImage.src}
        alt={data.hero?.image.alt ?? ""}
        width={`${data.hero?.image.variations?.[0]?.width ?? defaultImage.width}`}
        height={`${data.hero?.image.variations?.[0]?.height ?? defaultImage.height}`}
        className="aspect-3/2 object-cover object-center"
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
