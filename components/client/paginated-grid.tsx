"use client";

import useSWR from "swr";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { Pagination } from "@uoguelph/react-components/pagination";
import { Typography } from "@uoguelph/react-components/typography";

type PaginatedGridData<T> = {
  results: T[];
  totalPages: number;
  total: number;
};

type PaginatedGridProps<T> = {
  url: string;
  render: (item: T, index: number) => ReactNode;
};

async function fetcher(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/*
 * This component is used to fetch paginated data from an api endpoint and render it in a grid.
 * For it to function correctly, the api endpoint must return a JSON object with the following structure:
 * {
 *   results: [], // The actual data to be rendered
 *   totalPages: number, // Denoting the total number of pages available
 *   total: number // Denoting the total number of items available
 * }
 * The endpoint also must support pagination using the 'page' query parameter.
 * For example /api/endpoint?page=1
 * */
export function PaginatedGrid<T>({ url, render }: PaginatedGridProps<T>) {
  const [page, setPage] = useState(0);

  // Reset page when the URL changes
  useEffect(() => {
    setPage(0);
  }, [url]);

  // Construct the search URL with the current page
  const searchUrl = useMemo(() => `${url}?page=${page}`, [page, url]);

  // Fetch data using SWR
  const { data, error, isLoading } = useSWR<PaginatedGridData<T>>(searchUrl, fetcher);

  const handlePageChange = (page: number) => {
    setPage(page);

    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center flex-1 py-5">
        <LoadingIndicator />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error || !data) {
    if (error) {
      console.error("Error fetching data: ", error);
    }

    return (
      <div className="flex w-full items-center justify-center flex-1 py-5">
        <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
          An error occurred while loading the data. Please try again later.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-8">
      {data.totalPages > 1 && (
        <Pagination
          color="yellow"
          count={data.totalPages}
          visible={5}
          page={page}
          onChange={handlePageChange}
          className="pb-8 pt-0"
        />
      )}

      <div className="mb-4 text-center text-sm opacity-70">
        Showing {data.results.length} of {data.total} results
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.results.map(render)}
      </div>

      {data.results.length === 0 && (
        <div className="flex w-full items-center justify-center flex-1 py-5">
          <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
            No results found.
          </Typography>
        </div>
      )}

      {data.totalPages > 1 && (
        <Pagination
          color="yellow"
          count={data.totalPages}
          visible={5}
          page={page}
          onChange={handlePageChange}
          className="pt-8 pb-0"
        />
      )}
    </div>
  );
}
