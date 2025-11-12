"use client";

import useSWR from "swr";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { Pagination } from "@uoguelph/react-components/pagination";
import { Typography } from "@uoguelph/react-components/typography";
import { useSearchParams, useRouter } from "next/navigation";

type PaginatedGridData<T> = {
  results: T[];
  totalPages: number;
  total: number;
};

type PaginatedGridProps<T> = {
  url: string;
  render: (item: T, index: number) => ReactNode;
  debounce?: number;
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
export function PaginatedGrid<T>({ url, render, debounce = 300 }: PaginatedGridProps<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize page from URL parameter, defaulting to 0
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('p');
    return pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0; // Convert from 1-based to 0-based
  });
  
  const [debouncedUrl, setDebouncedUrl] = useState(url);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset page when the base URL changes (but not when only search params change)
  useEffect(() => {
    const baseUrl = url.split('?')[0];
    const currentBaseUrl = debouncedUrl.split('?')[0];
    if (baseUrl !== currentBaseUrl) {
      setPage(0);
      // Update URL to remove page parameter when resetting
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('p');
      const newUrl = newParams.toString() ? `?${newParams.toString()}` : '';
      router.replace(newUrl, { scroll: false });
    }
  }, [url, debouncedUrl, searchParams, router]);

  // Debounce the URL changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    } else {
      setIsDebouncing(true);
      timeoutRef.current = setTimeout(() => {
        setDebouncedUrl(url);
        setIsDebouncing(false);
      }, debounce);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [url, debounce]);

  // Construct the search URL with the current page
  const searchUrl = useMemo(() => {
    if (debouncedUrl.includes("?")) {
      return `${debouncedUrl}&page=${page}`;
    }

    return `${debouncedUrl}?page=${page}`;
  }, [page, debouncedUrl]);

  // Fetch data using SWR
  const { data, error, isLoading } = useSWR<PaginatedGridData<T>>(searchUrl, fetcher);

  const handlePageChange = (page: number) => {
    setPage(page);

    // Update URL with new page number (convert from 0-based to 1-based for display)
    const newParams = new URLSearchParams(searchParams.toString());
    if (page === 0) {
      newParams.delete('p'); // Remove page parameter for first page
    } else {
      newParams.set('p', (page + 1).toString()); // Convert to 1-based for URL
    }
    const newUrl = newParams.toString() ? `?${newParams.toString()}` : '';
    router.replace(newUrl, { scroll: false });

    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading || isDebouncing) {
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
