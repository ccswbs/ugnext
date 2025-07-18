"use client";

import { Checkbox } from "@uoguelph/react-components/checkbox";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Container } from "@uoguelph/react-components/container";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Select, SelectOptions, SelectOption, SelectButton } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";

type Profile = {
  id: string;
  name: string;
  types?: { id: string; name: string }[];
  units?: { id: string; name: string }[];
  // Add other properties as needed
};

type Unit = {
  id: string;
  name: string;
  // Add other properties as needed
};

type FacultySearchBarProps = {
  profiles: Profile[];
  units: Unit[];
  onChange?: (filtered: Profile[]) => void;
  className?: string;
};

export const FacultySearchBar = ({ profiles, units, onChange, className }: FacultySearchBarProps) => {
  
  const [input, setInput] = useState("");
  const results = useSearch(profiles, input, nameAndTagSearch);
  //const [selectedTypes, setSelectedTypes] = useState(types?.map(type => type.id) ?? []);
  const [selectedUnits, setSelectedUnits] = useState(units?.map(unit => unit.id) ?? []);

  const filtered = useMemo(() => {
    let filtered = results;

    {/* Change this to a research topic search
    if (Array.isArray(types) && types.length > 0) {
      filtered = filtered.filter((profile) =>
        profile.types?.some((type) => selectedTypes.includes(type.id))
      );
    }
    */}

    if (Array.isArray(units) && units.length > 0) {
      filtered = filtered.filter((profile: Profile) =>
        profile.units?.some((unit: Unit) => selectedUnits.includes(unit.id))
      );
    }

    return filtered;
  }, [results, selectedUnits, units]);

  useEffect(() => {
    onChange?.(filtered);
  }, [filtered, onChange]);

  return (
    <div className="bg-grey-light-bg border-t-4 border-yellow w-full -m-1">
      <Container className={twMerge("flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>
        <div className="flex-1">
          <TextInput
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Enter Name"
          >
            <span className="text-l font-bold mb-1">Search by First or Last Name</span>
          </TextInput>
        </div>

        {/* TODO: Change to research topic search
        {types?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by role</Label>
              <Select
                multiple
                onChange={(value) => {
                  const selectedIds = Array.isArray(value) ? value : [];
                  setSelectedTypes(selectedIds.length > 0 ? selectedIds : types?.map(type => type.id) ?? []);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {types?.filter(type => selectedTypes.includes(type.id)).map(type => type.name).join(", ")}
                  </span>
                </SelectButton>
                <SelectOptions>
                  {types.map((type) => (
                    <SelectOption value={type.id} key={type.id}>
                      {type.name}
                    </SelectOption>
                  ))}
                </SelectOptions>
              </Select>
            </Field>
          </div>
        )} 
        */}
        
        <div className="sm:w-1/3 md:w-1/4">
          <TextInput
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Placeholder - to be implemented"
          >
            <span className="text-l font-bold mb-1">Search by Research Topic</span>
          </TextInput>
          </div>

        {units?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by college, department, or unit</Label>
              <Select
                multiple
                onChange={(value) => {
                  // Handle the case where value might be a string, array, or other type
                  const selectedIds = Array.isArray(value) ? value : [];
                  setSelectedUnits(selectedIds.length > 0 ? selectedIds : units?.map(unit => unit.id) ?? []);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {units?.filter(unit => selectedUnits.includes(unit.id)).map(unit => unit.name).join(", ")}
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
        
        <div className="flex flex-row">
          <span className="pe-3 text-body-copy-bold font-bold">Accepting new grad students</span>
          <Checkbox />
        </div>
      </Container>
    </div>
  );
};
