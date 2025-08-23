"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Select, SelectOptions, SelectOption, SelectButton } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";
import { ProfileGrid } from "@/components/client/profiles/profile-grid";
import { ProfileSearchNavigation } from "@/components/client/profiles/profile-search-navigation";
import { useState, useMemo, useEffect } from "react";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { twMerge } from "tailwind-merge";

// Type definition matching the GraphQL fragment
interface ProfileBlockData {
  __typename: "ParagraphProfileBlock";
  id: string;
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6" | null;
  profileBlockTitle: string;
  profileType?: {
    name: string;
  }[];
  researchArea?: {
    name: string;
  }[];
  unit?: {
    name: string;
  }[];
  profiles?: any[];
  // New CMS-configurable search/filter options
  enableNameSearch?: boolean;
  enableResearchFilter?: boolean;
  enableTypeFilter?: boolean;
  enableUnitFilter?: boolean;
}

interface ProfileBlockProps {
  data: ProfileBlockData;
}

export const ProfileBlock = ({ data }: ProfileBlockProps) => {
  // Use the pre-fetched profiles from the data object
  const profiles = data.profiles || [];
  
  // Get search/filter configuration from CMS data
  const enableSearch = data.enableNameSearch ?? false;
  const enableUnitFilter = data.enableUnitFilter ?? false;
  const enableResearchFilter = data.enableResearchFilter ?? false;
  const enableTypeFilter = data.enableTypeFilter ?? false;
  
  // Search and filter state
  const [searchInput, setSearchInput] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedResearchAreas, setSelectedResearchAreas] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  
  // Search functionality using the same hook as faculty search
  const searchResults = useSearch(profiles, searchInput, nameAndTagSearch);
  
  // Extract unique units and research areas from profiles for filtering
  const availableUnits = useMemo(() => {
    const units = new Set<string>();
    profiles.forEach(profile => {
      profile.profileUnit?.forEach((unit: any) => {
        units.add(unit.name);
      });
    });
    return Array.from(units).sort();
  }, [profiles]);
  
  const availableResearchAreas = useMemo(() => {
    const areas = new Set<string>();
    profiles.forEach(profile => {
      profile.profileResearchAreas?.forEach((area: any) => {
        areas.add(area.name);
      });
    });
    return Array.from(areas).sort();
  }, [profiles]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    profiles.forEach(profile => {
      if (profile.profileType?.name) {
        types.add(profile.profileType.name);
      }
    });
    return Array.from(types).sort();
  }, [profiles]);

  // Create tabs for type filtering
  const typeTabs = useMemo(() => {
    if (!enableTypeFilter || availableTypes.length === 0) return null;
    
    const tabs = [
      { value: "all", label: "All" },
      ...availableTypes.map(type => ({ value: type, label: type }))
    ];
    
    return tabs;
  }, [availableTypes, enableTypeFilter]);
  
  // Initialize filters with all available options
  useEffect(() => {
    if (enableUnitFilter && selectedUnits.length === 0 && availableUnits.length > 0) {
      setSelectedUnits(availableUnits);
    }
    if (enableResearchFilter && selectedResearchAreas.length === 0 && availableResearchAreas.length > 0) {
      setSelectedResearchAreas(availableResearchAreas);
    }
    // Type filter uses "all" as default, no need to initialize
  }, [availableUnits, availableResearchAreas, enableUnitFilter, enableResearchFilter]);

  // Apply all filtering logic
  const filteredProfiles = useMemo(() => {
    let filtered = searchResults;

    // Filter by backend configuration first (original logic)
    filtered = filtered.filter((profile: any) => {
      // Filter by profile type if specified in backend
      if (data.profileType && data.profileType.length > 0) {
        const typeNames = data.profileType.map(t => t.name);
        const hasMatchingType = typeNames.includes(profile.profileType?.name);
        if (!hasMatchingType) {
          return false;
        }
      }

      // Filter by research area if specified in backend
      if (data.researchArea && data.researchArea.length > 0) {
        const researchNames = data.researchArea.map(r => r.name);
        const hasMatchingResearch = profile.profileResearchAreas?.some(
          (area: any) => researchNames.includes(area.name)
        );
        if (!hasMatchingResearch) {
          return false;
        }
      }

      // Filter by unit if specified in backend
      if (data.unit && data.unit.length > 0) {
        const unitNames = data.unit.map(u => u.name);
        const hasMatchingUnit = profile.profileUnit?.some(
          (unit: any) => unitNames.includes(unit.name)
        );
        if (!hasMatchingUnit) {
          return false;
        }
      }

      return true;
    });

    // Apply client-side unit filtering if enabled
    if (enableUnitFilter && selectedUnits.length > 0 && selectedUnits.length < availableUnits.length) {
      filtered = filtered.filter((profile: any) =>
        profile.profileUnit?.some((unit: any) => selectedUnits.includes(unit.name))
      );
    }

    // Apply client-side type filtering if enabled
    if (enableTypeFilter && selectedType !== "all") {
      filtered = filtered.filter((profile: any) =>
        profile.profileType?.name === selectedType
      );
    }

    // Apply client-side research area filtering if enabled
    if (enableResearchFilter && selectedResearchAreas.length > 0 && selectedResearchAreas.length < availableResearchAreas.length) {
      filtered = filtered.filter((profile: any) =>
        profile.profileResearchAreas?.some((area: any) => selectedResearchAreas.includes(area.name))
      );
    }

    return filtered;
  }, [searchResults, data, selectedUnits, selectedResearchAreas, selectedType, availableUnits.length, availableResearchAreas.length, enableUnitFilter, enableResearchFilter, enableTypeFilter]);

  return (
    <>
      {data.profileBlockTitle && (
        <Container>
          <Typography 
            type={data.headingLevel ?? "h2"} 
            as={data.headingLevel ?? "h2"}
          >
            {data.profileBlockTitle}
          </Typography>
        </Container>
      )}
      
      {/* Type Filter Navigation */}
      {enableTypeFilter && typeTabs && (
        <Container className="mb-[-0.5rem] py-0!">
          <ProfileSearchNavigation 
            tabs={typeTabs}
            selectedTab={selectedType}
            onTabChange={setSelectedType}
            useRouting={false}
          />
        </Container>
      )}
      
      {/* Search and Filter Controls */}
      {(enableSearch || enableUnitFilter || enableResearchFilter) && (
        <div className="bg-grey-light-bg border-t-4 border-yellow w-full -mx-[1rem] mb-8">
          <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-end">
            {/* Name Search */}
            {enableSearch && (
              <div className="md:w-1/2">
                <TextInput
                  onInput={(e) => setSearchInput((e.target as HTMLInputElement).value)}
                  placeholder="Start typing to search"
                >
                  <span className="text-l font-bold mb-1">Search by First or Last Name</span>
                </TextInput>
              </div>
            )}
            
            {/* Unit Filter */}
            {enableUnitFilter && availableUnits.length > 0 && (
              <div className="md:w-1/2">
                <Field>
                  <Label className="text-body-copy-bold font-bold">Filter by Unit</Label>
                  <Select
                    multiple
                    as="div"
                    onChange={(value) => {
                      const selectedIds = Array.isArray(value) ? value : [];
                      setSelectedUnits(selectedIds.length > 0 ? selectedIds : availableUnits);
                    }}
                  >
                    <SelectButton>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                        {selectedUnits.length === availableUnits.length 
                          ? "All Units" 
                          : selectedUnits.length === 0
                            ? "Select Units"
                            : selectedUnits.slice(0, 2).join(", ") + (selectedUnits.length > 2 ? `, +${selectedUnits.length - 2} more` : "")
                        }
                      </span>
                    </SelectButton>
                    <SelectOptions>
                      {availableUnits.map((unit) => (
                        <SelectOption value={unit} key={unit}>
                          {unit}
                        </SelectOption>
                      ))}
                    </SelectOptions>
                  </Select>
                </Field>
              </div>
            )}
            
            {/* Research Area Filter */}
            {enableResearchFilter && availableResearchAreas.length > 0 && (
              <div className="md:w-1/2">
                <Field>
                  <Label className="text-body-copy-bold font-bold">Filter by Research Area</Label>
                  <Select
                    multiple
                    as="div"
                    onChange={(value) => {
                      const selectedIds = Array.isArray(value) ? value : [];
                      setSelectedResearchAreas(selectedIds.length > 0 ? selectedIds : availableResearchAreas);
                    }}
                  >
                    <SelectButton>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                        {selectedResearchAreas.length === availableResearchAreas.length 
                          ? "All Research Areas" 
                          : selectedResearchAreas.length === 0
                            ? "Select Research Areas"
                            : selectedResearchAreas.slice(0, 2).join(", ") + (selectedResearchAreas.length > 2 ? `, +${selectedResearchAreas.length - 2} more` : "")
                        }
                      </span>
                    </SelectButton>
                    <SelectOptions>
                      {availableResearchAreas.map((area) => (
                        <SelectOption value={area} key={area}>
                          {area}
                        </SelectOption>
                      ))}
                    </SelectOptions>
                  </Select>
                </Field>
              </div>
            )}
          </Container>
        </div>
      )}
      
      {filteredProfiles.length > 0 ? (
        <Container>
          <ProfileGrid
            profiles={filteredProfiles}
            gridClasses={
              enableSearch || enableUnitFilter || enableResearchFilter || enableTypeFilter
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                : "grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]"
            }
          />
        </Container>
      ) : (
        <div className="flex w-full items-center justify-center py-8">
          <Typography type="body" className="text-black/50">
            No profiles matching the specified criteria were found.
          </Typography>
        </div>
      )}
    </>
  );
};
