"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid-new";
import type { PartialProfileData } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import Link from "next/link";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo.png";

function ProfileCard({ data }: { data: PartialProfileData }) {
  return (
    <Card key={data.id} as={Link} href={data.path ?? ""} className="border border-grey-light rounded shadow">
      <CardImage
        as={Image}
        src={data.profilePicture?.image?.variations?.[0]?.url ?? defaultImage.src}
        alt={data.profilePicture?.image?.alt ?? ""}
        width={`${data.profilePicture?.image?.variations?.[0]?.width ?? defaultImage.width}`}
        height={`${data.profilePicture?.image?.variations?.[0]?.height ?? defaultImage.height}`}
        className="aspect-square object-cover object-center"
      />

      <CardContent>
        <CardTitle>{data.title}</CardTitle>

        {data.profileJobTitle && <span>{data.profileJobTitle}</span>}
      </CardContent>
    </Card>
  );
}

export function ProfileSearchGrid() {
  return (
    <Container>
      <PaginatedGrid
        endpoint={(page: number) => `/api/profiles/search?page=${page}`}
        render={(item: PartialProfileData) => <ProfileCard key={item.id} data={item} />}
      />
    </Container>
  );
}
