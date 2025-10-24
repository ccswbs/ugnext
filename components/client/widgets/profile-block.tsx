"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileBlockFragment } from "@/lib/graphql/types";
import { ProfileSearch } from "@/components/client/profiles/profile-search";
import { ProfileTypeFilter } from "@/components/client/profiles/profile-type-filter";
import useSWR from "swr";
import type { ProfileType } from "@/data/drupal/profile";
import { useState } from "react";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ProfileBlock = ({ data }: { data: ProfileBlockFragment }) => {
  // Fetch profile types from API only if type filtering is enabled
  const { data: profileTypes, error } = useSWR<ProfileType[]>(
    data.enableTypeFilter ? '/api/profiles/get-types' : null, 
    fetcher
  );

  // State to track the selected profile type for filtering
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

  // Map the GraphQL units to the expected Unit type
  const availableUnits = data.unit?.map((unit) => ({
    __typename: "TermUnit" as const,
    id: unit.id,
    name: unit.name,
    acronym: unit.acronym || "",
    parent: null // GraphQL fragment doesn't include parent, so set to null
  }));

  // Determine the types to pass to ProfileSearch
  const typesForSearch = selectedTypeId ? [selectedTypeId] : (data.enableTypeFilter ? [] : []);

  return (
    <>
      {data.enableTypeFilter && profileTypes && (
        <ProfileTypeFilter 
          types={profileTypes} 
          onTypeChange={setSelectedTypeId}
          defaultTypeId={null}
        />
      )}
      <ProfileSearch
        key={`profile-search-${selectedTypeId || 'all'}`} // Force re-render when type changes
        queryByName={{
          enabled: data.enableNameSearch ?? false,
        }}
        queryByResearchArea={{
          enabled: data.enableResearchFilter ?? false,
        }}
        units={{
          enabled: data.enableUnitFilter ?? false,
          defaultValue: data.unit?.map((unit) => unit.id) ?? undefined,
        }}
        types={{
          enabled: data.enableTypeFilter ?? false,
          defaultValue: typesForSearch,
        }}
        isAcceptingGraduateStudents={{
          enabled: false,
        }}
        availableUnits={availableUnits}
      />
    </>
  );
};
