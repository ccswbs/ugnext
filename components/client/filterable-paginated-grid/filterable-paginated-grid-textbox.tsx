"use client";

import {
  FilterablePaginatedGridContext,
  FilterablePaginatedGridFilter,
} from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { TextInput } from "@uoguelph/react-components/text-input";
import { useContext, useEffect } from "react";

export function FilterablePaginatedGridTextBox({ id, label, defaultValue }: FilterablePaginatedGridFilter<string>) {
  const context = useContext(FilterablePaginatedGridContext);

  if (!context) {
    console.error("FilterablePaginatedGridTextBox must be used within a FilterablePaginatedGrid");
    return null;
  }

  useEffect(() => {
    if (defaultValue) {
      context.setFilters({
        ...context.filters,
        [id]: defaultValue,
      });
    }
  }, [defaultValue]);

  return (
    <div className="flex-1">
      <TextInput
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
