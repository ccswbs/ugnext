"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import type { PartialProfileData, Unit } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/profiles/profile-card";
import type { ProfileSearchOptions } from "@/data/drupal/profile";
import { useEffect, useMemo, useState } from "react";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Select, SelectOptions, SelectButton, SelectOption } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";
import { types } from "node:util";

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
  const [options, setOptions] = useState<Omit<ProfileSearchOptions, "page" | "pageSize">>({
    queryByName: props.queryByName.defaultValue ?? "",
    queryByResearchArea: props.queryByResearchArea.defaultValue ?? "",
    units: props.units.defaultValue ?? [],
    types: props.types.defaultValue ?? [],
    isAcceptingGraduateStudents: props.isAcceptingGraduateStudents.defaultValue ?? null,
  });

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

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

    if (options.types && options.types.length > 0) {
      params.set("types", options.types.join(","));
    }

    if (options.isAcceptingGraduateStudents !== null) {
      params.set("isAcceptingGraduateStudents", options.isAcceptingGraduateStudents.toString());
    }

    return `/api/profiles/get-profiles?${params.toString()}`;
  }, [options, selectedUnit]);

  return (
    <>
      <div className="w-full bg-yellow -mt-1">
        <Container className="w-full bg-yellow flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end empty:hidden">
          {props.queryByName.enabled && (
            <div className="flex-1">
              <TextInput
                onInput={(e) => {
                  setOptions((prevState) => {
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
                onInput={(e) => {
                  setOptions((prevState) => {
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
                  setSelectedUnit(value);
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
                      {unit.parent ? `${unit.parent.name} - ${unit.name}` : unit.name}
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
