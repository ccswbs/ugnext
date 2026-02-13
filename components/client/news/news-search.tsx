"use client";

import {
  FilterablePaginatedGrid,
  FilterablePaginatedGridTextBox,
} from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { NewsCategoryFragment, NewsWithoutContentFragment, UnitFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";
import { useMemo } from "react";

export type NewsSearchParams = {
  enableKeywordSearch?: boolean;
  enableCategorySearch?: boolean;
  unit?: string;
  categories?: string[];
  allCategories?: NewsCategoryFragment[];
};

export function NewsSearch({ enableKeywordSearch, enableCategorySearch, unit, categories }: NewsSearchParams) {
  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (!unit && !categories) return `/api/news/get-news`;

    if (unit) {
      params.append("unit", unit);
    }

    if (categories && !enableCategorySearch && categories.length > 0) {
      params.append("categories", categories.join(","));
    }

    return `/api/news/get-news?${params.toString()}`;
  }, [unit, categories]);

  return (
    <FilterablePaginatedGrid
      url={url}
      render={(item: NewsWithoutContentFragment) => <NewsCard key={item.id} data={item} />}
    >
      {enableKeywordSearch && <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />}
    </FilterablePaginatedGrid>
  );
}
