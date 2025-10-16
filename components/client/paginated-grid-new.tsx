"use client";

import useSWR from "swr";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { Pagination } from "@uoguelph/react-components/pagination";
import { twJoin } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";

type PaginatedGridData<T> = {
  results: T[];
  totalPages: number;
  total: number;
};

type PaginatedGridSharedProps<T> = {
  endpoint: (page: number) => string;
  render: (item: T, index: number) => ReactNode;
};

type PaginatedGridPageProps<T> = {
  page: number;
} & PaginatedGridSharedProps<T>;

type PaginatedGridProps<T> = {
  hidePaginationInput?: boolean;
} & PaginatedGridSharedProps<T>;

type PaginatedGridContextObj = {
  setTotalPages: (totalPages: number) => void;
  setIsLoading: (isLoading: boolean) => void;
};

const PaginatedGridContext = createContext<PaginatedGridContextObj | null>(null);

async function fetcher(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function PaginatedGridPage<T>({ page, endpoint, render }: PaginatedGridPageProps<T>) {
  const context = useContext(PaginatedGridContext);
  const url = endpoint(page);
  const { data, error, isLoading } = useSWR<PaginatedGridData<T>>(url, fetcher);
  const classes = twJoin("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5");

  useEffect(() => {
    if (data && context && "totalPages" in data && typeof data.totalPages === "number") {
      context.setTotalPages(data.totalPages);
    }
  }, [context, data]);

  useEffect(() => {
    if (context) {
      context.setIsLoading(isLoading);
    }
  }, [context, isLoading]);

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
        <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
          An error occurred while loading the data. Please try again later.
        </Typography>
      </div>
    );
  }

  if (
    !("results" in data) ||
    !("totalPages" in data) ||
    !("total" in data) ||
    !Array.isArray(data.results) ||
    typeof data.totalPages !== "number" ||
    typeof data.total !== "number"
  ) {
    throw new Error(
      "Invalid data structure: expected 'results' array and 'totalPages' numeric properties from API response."
    );
  }

  return (
    <div>
      <div className="mb-4 text-center text-sm opacity-70">
        Showing {data.results.length} of {data.total} results
      </div>
      <div className={classes}>{data.results.map(render)}</div>

      {data.results.length === 0 && (
        <div className="flex w-full items-center justify-center flex-1 py-5">
          <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
            No results found.
          </Typography>
        </div>
      )}
    </div>
  );
}

export function PaginatedGrid<T>({ endpoint, render, hidePaginationInput = false }: PaginatedGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (page: number) => {
    if (isLoading) return;

    setCurrentPage(page);
    setIsLoading(true);

    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col py-8">
      {totalPages > 1 && (
        <Pagination
          color="yellow"
          count={totalPages}
          visible={5}
          page={currentPage}
          hideInput={hidePaginationInput}
          onChange={handlePageChange}
          className="pb-8 pt-0"
        />
      )}

      <PaginatedGridContext.Provider value={{ setTotalPages, setIsLoading }}>
        <PaginatedGridPage page={currentPage} endpoint={endpoint} render={render} />
      </PaginatedGridContext.Provider>

      {totalPages > 1 && (
        <Pagination
          color="yellow"
          count={totalPages}
          visible={5}
          page={currentPage}
          hideInput={hidePaginationInput}
          onChange={handlePageChange}
          className="pt-8 pb-0"
        />
      )}
    </div>
  );
}
