"use client";

import { Checkbox } from "@uoguelph/react-components/checkbox";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Container } from "@uoguelph/react-components/container";
import { useFacultySearch } from "@/lib/use-profile-search";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Select, SelectOptions, SelectOption, SelectButton } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";
import { FullProfile, ProfileUnit } from "@/lib/types/profile";

type Unit = ProfileUnit;
type Profile = FullProfile;

type FacultySearchBarProps = {
  profiles?: Profile[]; // Make optional since we'll fetch data ourselves
  units: Unit[];
  onChange?: (filtered: Profile[], isLoading?: boolean) => void;
  onSearchChange?: (searchTerm: string, selectedUnits: string[]) => void;
  className?: string;
};

export const FacultySearchBar = ({ units, onChange, onSearchChange, className }: FacultySearchBarProps) => {
  const [input, setInput] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  
  // If using the new callback pattern, call it when search parameters change
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(input, selectedUnits);
    }
  }, [input, selectedUnits, onSearchChange]);

  // Fallback to old search hook if using the old callback pattern
  const { results, isLoading, error } = onSearchChange ? 
    { results: [], isLoading: false, error: undefined } : 
    useFacultySearch(input, selectedUnits.length > 0 ? selectedUnits : []);

  useEffect(() => {
    if (onChange && !onSearchChange) {
      onChange(results, isLoading);
    }
  }, [results, isLoading, onChange, onSearchChange]);

  // Show error if there's an issue with the search
  if (error) {
    console.error('Faculty search error:', error);
  }

  return (
    <div className="bg-grey-light-bg border-t-4 border-yellow w-full -m-1">

      <Container className={twMerge("flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>      

        <div className="md:w-1/3">
          <TextInput
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Start typing to search"
            disabled={isLoading}
            className={isLoading ? "opacity-50 cursor-wait" : ""}
          >
            <span className="text-l font-bold mb-1 flex items-center">
              Search by First or Last Name
              {isLoading && (
                <span className="ml-2 flex items-center text-sm text-gray-600">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              )}
            </span>
          </TextInput>
        </div>
        
        {units?.length > 0 && (
          <div className="md:w-1/3">
            <Field>
              <Label className="text-body-copy-bold font-bold flex items-center">
                Filter by college, department, or unit
                {isLoading && selectedUnits.length > 0 && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </Label>
              <Select
                multiple
                as="div"
                disabled={isLoading}
                onChange={(value) => {
                  // Handle the case where value might be a string, array, or other type
                  const selectedIds = Array.isArray(value) ? value : [];
                  setSelectedUnits(selectedIds);
                }}
              >
                <SelectButton className={isLoading ? "opacity-50 cursor-wait" : ""}>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {selectedUnits.length === 0 ? 
                      "All units" : 
                      units?.filter(unit => selectedUnits.includes(unit.id)).map(unit => unit.name).join(", ")
                    }
                  </span>
                </SelectButton>
                <SelectOptions>
                  {units.map((unit) => (
                    <SelectOption value={unit.id} key={unit.id}>
                      {unit.name}
                    </SelectOption>
                  ))}
                </SelectOptions>
              </Select>
            </Field>
          </div>
        )}
        
        <div className="flex flex-row items-center self-start mt-9">
          <Checkbox />
          <span className="ps-3 text-body-copy-bold font-bold"> Accepting new graduate students</span>          
        </div>
      </Container>
    </div>
  );
};
