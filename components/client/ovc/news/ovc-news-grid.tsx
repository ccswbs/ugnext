"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Image from "next/image";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import { UnstyledLink } from "@/components/client/unstyled-link";
import { Container } from "@uoguelph/react-components/container";

export function OvcNewsGrid({ totalPages = 2 }: { totalPages?: number }) {
  return (
    <Container>
      <PaginatedGrid
        hidePaginationInput={true}
        totalPages={totalPages}
        endpoint={(page: number) => `/api/ovc/news/get-news-articles?page=${page}`}
        render={(item: any, index: number) => {
          return (
            <Card
              key={index}
              as={UnstyledLink}
              href={`/ovc/news/${item.id}`}
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
