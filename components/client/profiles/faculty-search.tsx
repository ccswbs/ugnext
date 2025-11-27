"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import type { PartialProfileData, Unit } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/profiles/profile-card";
import type { ProfileSearchOptions } from "@/data/drupal/profile";
import { useMemo, useState, useEffect, useCallback } from "react";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Select, SelectOptions, SelectButton, SelectOption } from "@uoguelph/react-components/select";
import { Field, Label, Button } from "@headlessui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();

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
  const [useVectorSearch, setUseVectorSearch] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [aiSearchActive, setAiSearchActive] = useState(false);

  // Handle AI search execution
  const executeAiSearch = useCallback(() => {
    console.log("=== EXECUTING AI SEARCH ===");
    console.log("AI Search Query:", aiSearchQuery);
    console.log("Current timestamp:", new Date().toISOString());
    
    if (aiSearchQuery.trim()) {
      // Clear regular research area search when using AI search
      setOptions((prevState) => ({
        ...prevState,
        queryByResearchArea: "",
      }));
      setUseVectorSearch(true);
      setAiSearchActive(true);
      console.log("AI search state updated", { aiSearchQuery, useVectorSearch: true, aiSearchActive: true });
    }
  }, [aiSearchQuery]);

  // Handle clearing AI search
  const clearAiSearch = useCallback(() => {
    setAiSearchQuery("");
    setAiSearchActive(false);
    setUseVectorSearch(false);
    // Also clear the regular research area to avoid any conflicts
    setOptions((prevState) => ({
      ...prevState,
      queryByResearchArea: "",
    }));
  }, []);

  // Handle Enter key for AI search
  const handleAiSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeAiSearch();
    }
  }, [executeAiSearch]);

  // Effect to update URL parameters when search options change
  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return;
    
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
    
    const searchString = params.toString();
    const newUrl = searchString ? `${pathname}?${searchString}` : pathname;
    
    // Only update if URL actually changed to avoid unnecessary updates
    if (window.location.pathname + window.location.search !== newUrl) {
      try {
        window.history.replaceState({}, '', newUrl);
        
        // Manually dispatch a popstate event to help Next.js stay in sync
        window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      } catch (error) {
        console.warn('Failed to update URL:', error);
        // Fallback to Next.js router
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [options.queryByName, options.queryByResearchArea, selectedUnit, pathname, router]);

  // Update state when search criteria change
  const updateOptions = useCallback((updater: (prev: typeof options) => typeof options) => {
    // If AI search is active, don't update regular search options to avoid conflicts
    if (!aiSearchActive) {
      setOptions(updater);
    }
  }, [aiSearchActive]);

  const updateSelectedUnit = useCallback((unit: Unit | null) => {
    setSelectedUnit(unit);
  }, []);

  const url = useMemo(() => {
    console.log("=== URL GENERATION ===");
    console.log("Current state:", { 
      aiSearchActive, 
      aiSearchQuery, 
      useVectorSearch, 
      regularResearchArea: options.queryByResearchArea 
    });

    const params = new URLSearchParams();

    if (options.queryByName) {
      params.set("queryByName", options.queryByName);
    }

    // Handle research area query based on search mode
    // ONLY use AI search query if it's explicitly activated (not just typed)
    if (aiSearchActive && useVectorSearch && aiSearchQuery) {
      // For AI search, use the AI query
      params.set("queryByResearchArea", aiSearchQuery);
      console.log("Using AI search query:", aiSearchQuery);
    } else if (options.queryByResearchArea && !aiSearchActive) {
      // For regular search, use the regular query only if AI is not active
      params.set("queryByResearchArea", options.queryByResearchArea);
      console.log("Using regular search query:", options.queryByResearchArea);
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

    // Only add cache-busting parameter if there are actual search parameters
    const hasSearchParams = params.has("queryByResearchArea") || params.has("queryByName");
    if (hasSearchParams) {
      params.set("_t", Date.now().toString());
    }

    // Choose API endpoint based on search mode - only use vector search if explicitly activated
    const endpoint = (useVectorSearch && aiSearchActive && aiSearchQuery) ? "/api/profiles/vector-search" : "/api/profiles/get-profiles";
    const finalUrl = `${endpoint}?${params.toString()}`;
    
    console.log("Generated URL:", finalUrl);
    return finalUrl;
  }, [options, selectedUnit, useVectorSearch, aiSearchActive, aiSearchQuery]);

  return (
    <>
      <div className="w-full border-t-4 border-yellow bg-grey-light-bg -mt-1">
        <Container className="w-full bg-grey-light-bg flex flex-col gap-4 py-[4rem]! empty:hidden">
          {/* First row: Name, Research Area, and Unit Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
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
                    // Only allow regular search updates when AI search is not active
                    if (!aiSearchActive) {
                      updateOptions((prevState) => {
                        return {
                          ...prevState,
                          queryByResearchArea: (e.target as HTMLInputElement).value,
                        };
                      });
                    }
                  }}
                  disabled={aiSearchActive}
                  className={aiSearchActive ? "opacity-50" : ""}
                >
                  <span className="text-yellow-contrast text-l font-bold mb-1">
                    Search by research area
                    {aiSearchActive && <span className="text-sm text-blue-200 ml-2">(AI search active)</span>}
                  </span>
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
          </div>

          {/* Second row: AI-Enhanced Search */}
          <div className="border-t border-yellow-light pt-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <TextInput
                  value={aiSearchQuery}
                  onChange={(e) => {
                    const newValue = (e.target as HTMLInputElement).value;
                    setAiSearchQuery(newValue);
                    // If user clears the field manually (including browser X), reset AI search state
                    if (!newValue.trim() && aiSearchActive) {
                      setAiSearchActive(false);
                      setUseVectorSearch(false);
                      setOptions((prevState) => ({
                        ...prevState,
                        queryByResearchArea: "",
                      }));
                    }
                  }}
                  onKeyDown={handleAiSearchKeyDown}
                  placeholder="e.g., machine learning, cancer research, environmental science..."
                  disabled={aiSearchActive}
                >
                  <span className="text-yellow-contrast text-l font-bold mb-1">AI-Enhanced Research Search</span>
                </TextInput>
              </div>
              <div className="flex flex-col justify-end">
                {!aiSearchActive ? (
                  <Button
                    onClick={executeAiSearch}
                    disabled={!aiSearchQuery.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    🔍 AI Search
                  </Button>
                ) : (
                  <Button
                    onClick={clearAiSearch}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    ✕ Clear
                  </Button>
                )}
              </div>
            </div>
            {aiSearchActive && (
              <div className="text-sm text-blue-200 mt-2">
                ✨ AI search active for: "{aiSearchQuery}"
              </div>
            )}
          </div>
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