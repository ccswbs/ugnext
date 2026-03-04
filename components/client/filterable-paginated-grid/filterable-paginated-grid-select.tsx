import {
  FilterablePaginatedGridContext,
  FilterablePaginatedGridFilter,
} from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { PropsWithChildren, useContext, useEffect } from "react";
import { Field, Label } from "@headlessui/react";
import { Select, SelectButton, SelectOption, SelectOptions } from "@uoguelph/react-components/select";
import { useState } from "react";

export type FilterablePaginatedGridSelectOption = {
  id: string;
  name: string;
};

export type FilterablePaginatedGridSelectProps = {
  multiple?: boolean;
  options: FilterablePaginatedGridSelectOption[];
} & FilterablePaginatedGridFilter<string[]>;

export function FilterablePaginatedGridSelect({
  id,
  label,
  defaultValue,
  multiple = false,
  options,
}: FilterablePaginatedGridSelectProps) {
  const [selectedOptions, setSelectedOptions] = useState<FilterablePaginatedGridSelectOption[]>(
    multiple ? [] : [options[0]]
  );

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  const context = useContext(FilterablePaginatedGridContext);

  if (!context) {
    console.error("FilterablePaginatedGridSelect must be used within a FilterablePaginatedGrid");
    return null;
  }

  return (
    <Field className="sm:w-1/3 md:w-1/4">
      <Label className="text-yellow-contrast font-bold">{label}</Label>
      <Select
        multiple={multiple}
        value={multiple ? selectedOptions : selectedOptions[0]}
        onChange={(value) => {
          setSelectedOptions(Array.isArray(value) ? value : [value]);

          const options = Array.isArray(value) ? value : [value];

          context.setFilters({
            ...context.filters,
            [id]: options.map((option) => option.id).join(", "),
          });
        }}
        as="div"
      >
        <SelectButton>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            {selectedOptions.length === options.length || selectedOptions.length === 0
              ? "All"
              : selectedOptions.map((option) => option.name).join(", ")}
          </span>
        </SelectButton>
        <SelectOptions>
          {options.map((option) => (
            <SelectOption key={option.id} value={option}>
              {option.name}
            </SelectOption>
          ))}
        </SelectOptions>
      </Select>
    </Field>
  );
}
