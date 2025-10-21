"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import type { PartialProfileData } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/profiles/profile-card";
import type { ProfileSearchOptions } from "@/data/drupal/profile";
import { useEffect, useMemo, useState } from "react";
import { TextInput } from "@uoguelph/react-components/text-input";
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
};

export function ProfileSearch(props: ProfileSearchProps) {
  const [options, setOptions] = useState<Omit<ProfileSearchOptions, "page" | "pageSize">>({
    queryByName: props.queryByName.defaultValue ?? "",
    queryByResearchArea: props.queryByResearchArea.defaultValue ?? "",
    units: props.units.defaultValue ?? [],
    types: props.types.defaultValue ?? [],
    isAcceptingGraduateStudents: props.isAcceptingGraduateStudents.defaultValue ?? null,
  });

  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (options.queryByName) {
      params.set("queryByName", options.queryByName);
    }

    if (options.queryByResearchArea) {
      params.set("queryByResearchArea", options.queryByResearchArea);
    }

    if (options.units && options.units.length > 0) {
      params.set("units", options.units.join(","));
    }

    if (options.types && options.types.length > 0) {
      params.set("types", options.types.join(","));
    }

    if (options.isAcceptingGraduateStudents !== null) {
      params.set("isAcceptingGraduateStudents", options.isAcceptingGraduateStudents.toString());
    }

    return `/api/profiles/get-profiles?${params.toString()}`;
  }, [options]);

  return (
    <>
      <div className="w-full bg-yellow -mt-1">
        <Container className="w-full bg-yellow flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end">
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
                  console.log(e);
                }}
              >
                <span className="text-yellow-contrast text-l font-bold mb-1">Search by research area</span>
              </TextInput>
            </div>
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
