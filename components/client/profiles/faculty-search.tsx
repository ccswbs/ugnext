"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import type { PartialProfileData, Unit } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/profiles/profile-card";
import type { ProfileSearchOptions } from "@/data/drupal/profile";
import { useMemo, useState, useEffect, useCallback } from "react";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Select, SelectOptions, SelectButton, SelectOption } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";
import { useSearchParams, useRouter } from "next/navigation";

type ProfileSearchField<T> = {
  enabled: boolean;
  defaultValue?: T;
};

export type FacultySearchProps = {
  queryByName: ProfileSearchField<string>;
  queryByResearchArea: ProfileSearchField<string>;
  queryByUnit: ProfileSearchField<string>;
  units: ProfileSearchField<string[]>;
  availableUnits?: Unit[];
  facultyTypeId: string; // The faculty profile type ID to restrict search to
  isAcceptingGraduateStudents: ProfileSearchField<boolean>;
};

export function FacultySearch(props: FacultySearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL parameters or default values
  const getInitialSelectedUnit = useCallback(() => {
    const unitId = searchParams.get('unit');
    if (unitId && props.availableUnits) {
      return props.availableUnits.find(unit => unit.id === unitId) || null;
    }
    return props.queryByUnit.defaultValue && props.availableUnits 
      ? props.availableUnits.find(unit => unit.id === props.queryByUnit.defaultValue) || null
      : null;
  }, [searchParams, props.availableUnits, props.queryByUnit.defaultValue]);

  const [options, setOptions] = useState<Omit<ProfileSearchOptions, "page" | "pageSize">>({
    queryByName: searchParams.get('name') || props.queryByName.defaultValue || "",
    queryByResearchArea: searchParams.get('research') || props.queryByResearchArea.defaultValue || "",
    units: props.units.defaultValue ?? [],
    types: [props.facultyTypeId], // Faculty search is restricted to faculty profiles
    isAcceptingGraduateStudents: props.isAcceptingGraduateStudents.defaultValue ?? null,
  });

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(getInitialSelectedUnit);

  // Effect to update URL parameters when search options change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (options.queryByName && options.queryByName.trim()) {
      params.set('name', options.queryByName);
    }
    
    if (options.queryByResearchArea && options.queryByResearchArea.trim()) {
      params.set('research', options.queryByResearchArea);
    }
    
    if (selectedUnit && selectedUnit.id) {
      params.set('unit', selectedUnit.id);
    }
    
    const url = params.toString() ? `?${params.toString()}` : '';
    router.replace(url, { scroll: false });
  }, [options.queryByName, options.queryByResearchArea, selectedUnit, router]);

  // Update state when search criteria change
  const updateOptions = useCallback((updater: (prev: typeof options) => typeof options) => {
    setOptions(updater);
  }, []);

  const updateSelectedUnit = useCallback((unit: Unit | null) => {
    setSelectedUnit(unit);
  }, []);

  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (options.queryByName) {
      params.set("queryByName", options.queryByName);
    }

    if (options.queryByResearchArea) {
      params.set("queryByResearchArea", options.queryByResearchArea);
    }

    // Combine units from props with selected unit from dropdown
    const allUnits = [...(options.units || [])];
    if (selectedUnit) {
      allUnits.push(selectedUnit.id);
    }

    if (allUnits.length > 0) {
      params.set("units", allUnits.join(","));
    }

    // IMPORTANT: Include types parameter to restrict to faculty profiles
    if (options.types && options.types.length > 0) {
      params.set("types", options.types.join(","));
    }

    if (options.isAcceptingGraduateStudents !== null) {
      params.set("isAcceptingGraduateStudents", options.isAcceptingGraduateStudents.toString());
    }

    const finalUrl = `/api/profiles/get-profiles?${params.toString()}`;
    
    return finalUrl;
  }, [options, selectedUnit]);

  return (
    <>
      <div className="w-full border-t-4 border-yellow bg-grey-light-bg -mt-1">
        <Container className="w-full bg-grey-light-bg flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end empty:hidden">
          {props.queryByName.enabled && (
            <div className="flex-1">
              <TextInput
                value={options.queryByName}
                onChange={(e) => {
                  updateOptions((prevState) => {
                    return {
                      ...prevState,
                      queryByName: (e.target as HTMLInputElement).value,
                    };
                  });
                }}
              >
                <span className="text-yellow-contrast text-l font-bold mb-1">Search by first or last name</span>
              </TextInput>
            </div>
          )}

          {props.queryByResearchArea.enabled && (
            <div className="flex-1">
              <TextInput
                value={options.queryByResearchArea}
                onChange={(e) => {
                  updateOptions((prevState) => {
                    return {
                      ...prevState,
                      queryByResearchArea: (e.target as HTMLInputElement).value,
                    };
                  });
                }}
              >
                <span className="text-yellow-contrast text-l font-bold mb-1">Search by research area</span>
              </TextInput>
            </div>
          )}

          {props.queryByUnit.enabled && props.availableUnits && props.availableUnits.length > 0 && (
            <Field className="sm:w-1/3 md:w-1/4">
              <Label className="text-yellow-contrast font-bold">Filter by unit</Label>
              <Select
                value={selectedUnit}
                onChange={(value) => {
                  updateSelectedUnit(value);
                }}
                as="div"
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {selectedUnit ? selectedUnit.name : "All units"}
                  </span>
                </SelectButton>
                <SelectOptions>
                  <SelectOption value={null} key="all-units">
                    All units
                  </SelectOption>
                  {(() => {
                    // Sort units so parent units are grouped with their children
                    const sortedUnits = [...props.availableUnits].sort((a, b) => {
                      // If both are parent units (no parent), sort alphabetically
                      if (!a.parent && !b.parent) {
                        return a.name.localeCompare(b.name);
                      }
                      
                      // If one is parent and one is child, parent comes first
                      if (!a.parent && b.parent) {
                        return a.name.localeCompare(b.parent.name) || -1;
                      }
                      if (a.parent && !b.parent) {
                        return a.parent.name.localeCompare(b.name) || 1;
                      }
                      
                      // If both are children, first sort by parent name, then by child name
                      if (a.parent && b.parent) {
                        const parentComparison = a.parent.name.localeCompare(b.parent.name);
                        if (parentComparison !== 0) {
                          return parentComparison;
                        }
                        return a.name.localeCompare(b.name);
                      }
                      
                      return 0;
                    });
                    
                    return sortedUnits.map((unit, index) => (
                      <SelectOption value={unit} key={`unit-${unit.id}-${index}`}>
                        {unit.parent ? `${unit.parent.acronym || unit.parent.name} - ${unit.name}` : unit.name}
                      </SelectOption>
                    ));
                  })()}
                </SelectOptions>
              </Select>
            </Field>
          )}
        </Container>
      </div>

      <Container>
        <PaginatedGrid
          debounce={500}
          url={url}
          render={(item: PartialProfileData) => <ProfileCard key={item.id} data={item} />}
        />
      </Container>
    </>
  );
}