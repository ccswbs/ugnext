"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Image from "next/image";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import Link from "next/link";
import { Container } from "@uoguelph/react-components/container";

export function OvcNewsGrid() {
  return (
    <Container>
      <PaginatedGrid
        url="/api/ovc/news/get-news-articles"
        render={(item: any, index: number) => {
          return (
            <Card
              key={index}
              as={Link}
              href={`/ovc/news/node/${item.id}`}
              className="border border-grey-light rounded shadow"
            >
              <CardImage
                as={Image}
                src={item?.heroImage?.image.url || defaultImage.src}
                alt={item?.heroImage?.image.alt || "OVC Front Entrance"}
                width={item?.heroImage?.image.width || defaultImage.width}
                height={item?.heroImage?.image.height || defaultImage.height}
                sizes={item?.heroImage?.image.sizes || "33vw"}
                className="aspect-[9/4] object-cover object-center"
              />

              <CardContent>
                <CardTitle>{item?.title}</CardTitle>

                <p className="text-sm mt-auto">{item?.articleDate}</p>
              </CardContent>
            </Card>
          );
        }}
      ></PaginatedGrid>
    </Container>
  );
}
