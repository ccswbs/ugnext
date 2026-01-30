"use client";

import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { Card, CardTitle } from "@uoguelph/react-components/card";

export function NewsCard({ data }: { data: NewsWithoutContentFragment }) {
  return (
    <Card className="card">
      <CardTitle>{data.title}</CardTitle>
    </Card>
  );
}
