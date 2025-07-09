import useSWR from "swr";
import { useState } from "react";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { Pagination } from "@uoguelph/react-components/pagination";
import { twJoin } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";

type PaginatedGridSharedProps<T> = {
  endpoint: (page: number) => string;
  render: (item: T, index: number) => React.ReactNode;
};

type PaginatedGridPageProps<T> = {
  page: number;
} & PaginatedGridSharedProps<T>;

async function fetcher(...args: Parameters<typeof fetch>) {
  return (await fetch(...args)).json();
}

function PaginatedGridPage<T>({ page, endpoint, render }: PaginatedGridPageProps<T>) {
  const url = endpoint(page);
  const { data, error, isLoading } = useSWR<T[]>(url, fetcher);
  const classes = twJoin("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5");

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center flex-1 py-5">
        <LoadingIndicator />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex w-full items-center justify-center flex-1 py-5">
        <Typography type="h1">An error occurred while loading the data.</Typography>
      </div>
    );
  }

  return <div className={classes}>{data.map(render)}</div>;
}

type PaginatedGridProps<T> = {
  totalPages: number;
  hidePaginationInput?: boolean;
} & PaginatedGridSharedProps<T>;

export function PaginatedGrid<T>({
  totalPages = 2,
  endpoint,
  render,
  hidePaginationInput = false,
}: PaginatedGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col py-8">
      <Pagination
        color="yellow"
        count={totalPages}
        visible={5}
        page={currentPage}
        hideInput={hidePaginationInput}
        onChange={handlePageChange}
        className="pb-8 pt-0"
      />

      <PaginatedGridPage page={currentPage} endpoint={endpoint} render={render} />

      {/* Prefetch the next page. */}
      <div className="hidden">
        <PaginatedGridPage page={currentPage + 1} endpoint={endpoint} render={render} />
      </div>

      <Pagination
        color="yellow"
        count={totalPages}
        visible={5}
        page={currentPage}
        hideInput={hidePaginationInput}
        onChange={handlePageChange}
        className="pt-8 pb-0"
      />
    </div>
  );
}
