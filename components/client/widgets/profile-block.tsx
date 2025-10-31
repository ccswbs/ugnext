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
  // Fetch profile types from API if type filtering is enabled OR if backend has selected types
  const backendHasSelectedTypes = data.profileType && data.profileType.length > 0;
  const shouldFetchTypes = data.enableTypeFilter || backendHasSelectedTypes;
  
  const { data: profileTypes, error } = useSWR<ProfileType[]>(
    shouldFetchTypes ? '/api/profiles/get-types' : null, 
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
  // If specific profile types are selected in the backend, use those
  // If user has selected a type via filter, use that
  // Otherwise, show all if no backend types are selected
  const backendSelectedTypes = data.profileType?.map(type => type.name).filter(Boolean) || [];
  
  let typesForSearch: string[] = [];
  if (selectedTypeId) {
    // User has selected a specific type via the filter
    typesForSearch = [selectedTypeId];
  } else if (backendSelectedTypes.length > 0) {
    // Backend has specific types selected, need to convert names to IDs
    // The API expects type IDs, not names
    if (profileTypes && profileTypes.length > 0) {
      const backendTypeIds = backendSelectedTypes
        .map(typeName => {
          const matchingType = profileTypes.find(pt => pt.name === typeName);
          return matchingType?.id;
        })
        .filter(Boolean) as string[];
      typesForSearch = backendTypeIds;
    } else {
      // If profileTypes not loaded yet, wait for them to load
      typesForSearch = [];
    }
  } else if (data.enableTypeFilter) {
    // No backend types selected and no user selection, show all when filtering is enabled
    typesForSearch = [];
  } else {
    // Type filtering not enabled, show all
    typesForSearch = [];
  }

  return (
    <>
      {data.profileBlockTitle && (
        <Typography 
          id={`profile-block-heading-${data.id}`} 
          type={(data.headingLevel ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"} 
          as={(data.headingLevel ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
        >
          {data.profileBlockTitle}
        </Typography>
      )}
      {data.enableTypeFilter && profileTypes && (
        <ProfileTypeFilter 
          types={profileTypes} 
          onTypeChange={setSelectedTypeId}
          defaultTypeId={null}
        />
      )}
      <ProfileSearch
        key={`profile-search-${selectedTypeId || 'all'}-${typesForSearch.join(',')}`} // Force re-render when type changes
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
