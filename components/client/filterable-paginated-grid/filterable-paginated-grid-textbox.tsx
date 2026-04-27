"use client";

import {
  FilterablePaginatedGridContext,
  FilterablePaginatedGridFilter,
} from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { TextInput } from "@uoguelph/react-components/text-input";
import { useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export function FilterablePaginatedGridTextBox({ id, label }: FilterablePaginatedGridFilter<string>) {
  const context = useContext(FilterablePaginatedGridContext);
  const searchParams = useSearchParams();
  const defaultValue = useMemo(() => {
    return searchParams.get(id) ?? "";
  }, [searchParams]);

  if (!context) {
    console.error("FilterablePaginatedGridTextBox must be used within a FilterablePaginatedGrid");
    return null;
  }

  return (
    <div className="flex-1">
      <TextInput
        value={defaultValue}
        onInput={(e) => {
          context.setFilters({
            ...context.filters,
            [id]: (e.target as HTMLInputElement).value,
          });
        }}
      >
        <span className="text-yellow-contrast text-l font-bold mb-1">{label}</span>
      </TextInput>
    </div>
  );
}
