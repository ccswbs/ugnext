"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileBlockFragment } from "@/lib/graphql/types";
import { ProfileSearch } from "@/components/client/profiles/profile-search";
import { ProfileTypeFilter } from "@/components/client/profiles/profile-type-filter";
import { ProfileCard } from "@/components/client/profiles/profile-card";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { slugify } from "@/lib/string-utils";
import useSWR from "swr";
import type { ProfileType, PartialProfileData } from "@/data/drupal/profile";
import { useState, useContext } from "react";
import { SectionContext } from "@/components/client/section";
import type { SectionContextType } from "@/lib/types/section-context";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ProfileBlock = ({ data }: { data: ProfileBlockFragment }) => {
  // Check if this is a secondary column using SectionContext - if so, skip search/pagination and show first 20 results
  const sectionContext = useContext(SectionContext) as SectionContextType | null;
  const isSecondaryColumn = sectionContext?.column === "secondary";

  // Helper function to render the profile block title
  const renderTitle = () => {
    if (!data.profileBlockTitle?.trim()) return null;
    
    return (
      <Typography 
        id={slugify(data.profileBlockTitle)} 
        type={(data.headingLevel ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"} 
        as={(data.headingLevel ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
      >
        {data.profileBlockTitle}
      </Typography>
    );
  };
  
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

  // For secondary columns, fetch profiles directly without pagination/search
  const secondaryColumnUrl = isSecondaryColumn ? (() => {
    const params = new URLSearchParams();
    
    // Add unit filters if specified
    if (data.unit && data.unit.length > 0) {
      params.set("units", data.unit.map(unit => unit.id).join(","));
    }
    
    // Add type filters if specified and profileTypes are loaded
    if (typesForSearch.length > 0) {
      params.set("types", typesForSearch.join(","));
    }
    
    // Set page size to 20 and page to 0 for first 20 results
    params.set("size", "20");
    params.set("page", "0");
    
    return `/api/profiles/get-profiles?${params.toString()}`;
  })() : null;

  const { data: secondaryProfiles, error: secondaryError, isLoading: secondaryLoading } = useSWR<{
    results: PartialProfileData[];
    totalPages: number;
    total: number;
  }>(
    secondaryColumnUrl,
    fetcher
  );

  // If this is a secondary column, render profiles directly without search/pagination
  if (isSecondaryColumn) {
    return (
      <>
        {renderTitle()}
        
        {secondaryLoading && (
          <div className="flex w-full items-center justify-center flex-1 py-5">
            <LoadingIndicator />
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {secondaryError && (
          <div className="flex w-full items-center justify-center flex-1 py-5">
            <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
              An error occurred while loading the profiles. Please try again later.
            </Typography>
          </div>
        )}
        
        {secondaryProfiles && (
          <Container>
            <div className="grid grid-cols-1 gap-5 py-8">
              {secondaryProfiles.results.map((profile) => (
                <ProfileCard key={profile.id} data={profile} />
              ))}
              {secondaryProfiles.results.length === 0 && (
                <div className="flex w-full items-center justify-center flex-1 py-5">
                  <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
                    No profiles found.
                  </Typography>
                </div>
              )}
            </div>
          </Container>
        )}
      </>
    );
  }

  // Default behavior for non-secondary columns
  return (
    <>
      {sectionContext ? renderTitle() : (
        <Container>
          {renderTitle()}
        </Container>
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
