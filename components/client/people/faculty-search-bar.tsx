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
  research?: { id: string; name: string }[];
  units?: { id: string; name: string }[];
  // Add other properties as needed
};

type research = {
  id: string;
  name: string;
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
  research: research[];
  onChange?: (filtered: Profile[]) => void;
  className?: string;
};

export const FacultySearchBar = ({ profiles, research, units, onChange, className }: FacultySearchBarProps) => {
  
  const [input, setInput] = useState("");
  const results = useSearch(profiles, input, nameAndTagSearch);
  const [selectedResearch, setSelectedResearch] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState(units?.map(unit => unit.id) ?? []);
  const [researchInput, setResearchInput] = useState("");
  const [showResearchDropdown, setShowResearchDropdown] = useState(false);
  const [filteredResearch, setFilteredResearch] = useState(research);

  // Update filteredResearch when research prop changes
  useEffect(() => {
    setFilteredResearch(research);
  }, [research]);

  const filtered = useMemo(() => {
    let filtered = results;

    if (selectedResearch.length > 0) {
      filtered = filtered.filter((profile: Profile) =>
        profile.research?.some((research) => selectedResearch.includes(research.id))
      );
    }
  
    if (Array.isArray(units) && units.length > 0) {
      filtered = filtered.filter((profile: Profile) =>
        profile.units?.some((unit: Unit) => selectedUnits.includes(unit.id))
      );
    }

    return filtered;
  }, [results, selectedResearch, selectedUnits, research, units]);

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

        {research?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by Research Area</Label>
              <div className="relative">
                <TextInput
                  value={researchInput}
                  placeholder="Type to search research areas..."
                  onInput={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    setResearchInput(value);
                    // Filter research based on input
                    const filteredResearch = research.filter(research => 
                      research.name.toLowerCase().includes(value.toLowerCase())
                    );
                    setFilteredResearch(filteredResearch);
                  }}
                  onFocus={() => setShowResearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowResearchDropdown(false), 200)}
                />
                {showResearchDropdown && filteredResearch.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredResearch.map((research) => (
                      <div
                        key={research.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          if (!selectedResearch.includes(research.id)) {
                            setSelectedResearch([...selectedResearch, research.id]);
                          }
                          setResearchInput('');
                          setShowResearchDropdown(false);
                        }}
                      >
                        {research.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Display selected research */}
              {selectedResearch.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {research
                    .filter(research => selectedResearch.includes(research.id))
                    .map((research) => (
                      <span
                        key={research.id}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {research.name}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedResearch(selectedResearch.filter(id => id !== research.id));
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </Field>
          </div>
        )}
        
        {/* <div className="sm:w-1/3 md:w-1/4">
          <TextInput
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Placeholder - to be implemented"
          >
            <span className="text-l font-bold mb-1">Search by Research Topic</span>
          </TextInput>
          </div> */}

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
        
        <div className="flex flex-row items-center self-start mt-9">
          <Checkbox />
          <span className="ps-3 text-body-copy-bold font-bold"> Accepting new grad students</span>          
        </div>
      </Container>
    </div>
  );
};
