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

export type ProfileSearchProps = {
  queryByName: ProfileSearchField<string>;
  queryByResearchArea: ProfileSearchField<string>;
  units: ProfileSearchField<string[]>;
  types: ProfileSearchField<string[]>;
  isAcceptingGraduateStudents: ProfileSearchField<boolean>;
  availableUnits?: Unit[];
};

export function ProfileSearch(props: ProfileSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL parameters or default values
  const getInitialSelectedUnit = useCallback(() => {
    const unitId = searchParams.get('unit');
    if (unitId && props.availableUnits) {
      return props.availableUnits.find(unit => unit.id === unitId) || null;
    }
    return null;
  }, [searchParams, props.availableUnits]);

  const [options, setOptions] = useState<Omit<ProfileSearchOptions, "page" | "pageSize">>({
    queryByName: searchParams.get('name') || props.queryByName.defaultValue || "",
    queryByResearchArea: searchParams.get('research') || props.queryByResearchArea.defaultValue || "",
    units: props.units.defaultValue ?? [],
    types: props.types.defaultValue ?? [],
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

  // Update options when props change (especially types.defaultValue)
  useEffect(() => {
    setOptions(prevOptions => ({
      ...prevOptions,
      queryByName: searchParams.get('name') || props.queryByName.defaultValue || prevOptions.queryByName,
      queryByResearchArea: searchParams.get('research') || props.queryByResearchArea.defaultValue || prevOptions.queryByResearchArea,
      units: props.units.defaultValue ?? prevOptions.units,
      types: props.types.defaultValue ?? prevOptions.types,
      isAcceptingGraduateStudents: props.isAcceptingGraduateStudents.defaultValue ?? prevOptions.isAcceptingGraduateStudents,
    }));
  }, [
    searchParams,
    props.queryByName.defaultValue,
    props.queryByResearchArea.defaultValue,
    props.units.defaultValue,
    props.types.defaultValue,
    props.isAcceptingGraduateStudents.defaultValue
  ]);

  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (options.queryByName) {
      params.set("queryByName", options.queryByName);
    }

    if (options.queryByResearchArea) {
      params.set("queryByResearchArea", options.queryByResearchArea);
    }

    // If a unit is selected from dropdown, use only that unit; otherwise use default units
    const unitsToFilter = selectedUnit ? [selectedUnit.id] : (options.units || []);

    if (unitsToFilter.length > 0) {
      params.set("units", unitsToFilter.join(","));
    }

    if (options.types && options.types.length > 0) {
      params.set("types", options.types.join(","));
    }

    if (options.isAcceptingGraduateStudents !== null) {
      params.set("isAcceptingGraduateStudents", options.isAcceptingGraduateStudents.toString());
    }

    const finalUrl = `/api/profiles/get-profiles?${params.toString()}`;
    
    return finalUrl;
  }, [options, selectedUnit]);

  const hasActiveTypes = props.types.enabled;
  const backgroundClass = hasActiveTypes ? "bg-yellow" : "bg-grey-light-bg";

  return (
    <>
      <div className={`w-full ${backgroundClass} border-t-4 border-yellow -mt-1`}>
        <Container className={`w-full ${backgroundClass} flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end empty:hidden`}>
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

          {props.units.enabled && props.availableUnits && props.availableUnits.length > 0 && (
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
                  {props.availableUnits.map((unit, index) => (
                    <SelectOption value={unit} key={`unit-${unit.id}-${index}`}>
                      {unit.parent ? `${unit.parent.acronym || unit.parent.name} - ${unit.name}` : unit.name}
                    </SelectOption>
                  ))}
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
