"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";

export type NewsCardParams = {
  unit: string;
  categories: string[];
  query: string;
};

export function NewsGrid() {
  return (
    <>
      <PaginatedGrid
        url="/api/news/get-news"
        render={(article: NewsWithoutContentFragment) => <NewsCard key={article.id} data={article} />}
      />
    </>
  );
}
