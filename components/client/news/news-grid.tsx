"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import { NewsWithoutContentFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";
import { NewsSearchOptions } from "@/data/drupal/news";
import { useMemo, useState } from "react";

export type NewsCardParams = {
  query?: {
    enabled: boolean;
    defaultValue: string;
  };
  unit?: {
    enabled: boolean;
    defaultValue: string;
  };
  categories?: {
    enabled: boolean;
    defaultValue: string[];
  };
};

export function NewsGrid({ options = {} }: { options: NewsCardParams }) {
  const [filters, setFilters] = useState<NewsSearchOptions>({
    page: 0,
    pageSize: 20,
    query: options?.query?.defaultValue,
    unit: options?.unit?.defaultValue,
    categories: options?.categories?.defaultValue,
  });

  const url = useMemo(() => {
    const { page, pageSize, query, unit, categories } = filters;

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (unit) params.append("unit", unit);
    if (categories) params.append("categories", categories.join(","));
    return `/api/news/get-news?page=${page}&pageSize=${pageSize}&${params.toString()}`;
  }, [filters]);

  return (
    <>
      <PaginatedGrid
        url={url}
        render={(article: NewsWithoutContentFragment) => <NewsCard key={article.id} data={article} />}
      />
    </>
  );
}
