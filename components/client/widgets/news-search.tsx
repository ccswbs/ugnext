import { NewsCategoryFragment, NewsSearchFragment, NewsWithoutContentFragment } from "@/lib/graphql/types";
import { useMemo } from "react";
import {
  FilterablePaginatedGrid,
  FilterablePaginatedGridSelect,
} from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { NewsCard } from "@/components/client/news/news-card";
import { FilterablePaginatedGridTextBox } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-textbox";
import useSWR from "swr";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";

async function fetcher(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function NewsSearch({ data }: { data: NewsSearchFragment }) {
  const url = useMemo(() => {
    if (!data.units || data.units.length === 0) return `/api/news/get-news`;

    return `/api/news/get-news?units=${data.units.map((unit) => unit.id).join(",")}`;
  }, [data]);

  const { data: categories, error, isLoading } = useSWR<NewsCategoryFragment[]>(`/api/news/get-categories`, fetcher);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center flex-1 py-5">
        <LoadingIndicator />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  console.log(categories);

  return (
    <FilterablePaginatedGrid
      url={url}
      render={(item: NewsWithoutContentFragment) => <NewsCard key={item.id} data={item} />}
    >
      <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />
      {categories && categories.length > 0 && (
        <FilterablePaginatedGridSelect
          id="categories"
          label="Filter by category"
          multiple={true}
          options={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        />
      )}
    </FilterablePaginatedGrid>
  );
}
