"use client";

import { PaginatedGrid, PaginatedGridProps } from "@/components/client/paginated-grid";
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Container } from "@uoguelph/react-components/container";

export type FilterablePaginatedGridFilterValue = string | string[] | boolean | number;

export type FilterablePaginatedGridFilter<T extends FilterablePaginatedGridFilterValue> = {
  id: string;
  label: string;
  defaultValue?: T;
};

export type FilterablePaginatedGridFilters = Record<string, FilterablePaginatedGridFilterValue>;

export type FilterablePaginatedGridContextValue = {
  filters: FilterablePaginatedGridFilters;
  setFilters: (filters: FilterablePaginatedGridFilters) => void;
};

export const FilterablePaginatedGridContext = createContext<FilterablePaginatedGridContextValue | null>(null);

export function FilterablePaginatedGrid<T>({
  url,
  render,
  debounce = 300,
  children,
}: PropsWithChildren<PaginatedGridProps<T>>) {
  const [filters, setFilters] = useState<FilterablePaginatedGridFilters>({});

  const urlWithFilters = useMemo(() => {
    const entries = Object.entries(filters);

    if (entries.length === 0) return url;

    const params = new URLSearchParams();

    for (const [key, value] of entries) {
      if (!value) continue;

      if (Array.isArray(value)) {
        params.append(key, value.join(","));
        continue;
      }
      params.append(key, value.toString());
    }

    if (url.includes("?")) {
      return `${url}&${params.toString()}`;
    }

    return `${url}?${params.toString()}`;
  }, [filters]);

  useEffect(() => {
    console.log(urlWithFilters);
  }, [filters]);

  return (
    <div>
      <div className="w-full border-t-4 border-yellow bg-grey-light-bg -mt-1">
        <FilterablePaginatedGridContext.Provider value={{ filters, setFilters }}>
          <Container className="w-full bg-grey-light-bg flex flex-col gap-4 py-10! sm:flex-row sm:items-end empty:hidden">
            {children}
          </Container>
        </FilterablePaginatedGridContext.Provider>
      </div>

      <Container>
        <PaginatedGrid url={urlWithFilters} render={render} debounce={debounce} />
      </Container>
    </div>
  );
}

export { FilterablePaginatedGridTextBox } from "./filterable-paginated-grid-textbox";
