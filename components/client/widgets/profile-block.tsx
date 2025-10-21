"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { ProfileGrid } from "@/components/client/profiles/profile-grid";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ProfileType, ProfileResearchArea, ProfileUnit, FullProfile } from "@/lib/types/profile";

// Component-specific interface that extends shared types
interface ProfileBlockData {
  __typename: "ParagraphProfileBlock";
  id: string;
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6" | null;
  profileBlockTitle: string;
  profileType?: ProfileType[];
  researchArea?: ProfileResearchArea[];
  unit?: ProfileUnit[];
  profiles?: FullProfile[];
}

interface ProfileBlockProps {
  data: ProfileBlockData;
}

export const ProfileBlock = ({ data }: ProfileBlockProps) => {
  /*const [profiles, setProfiles] = useState<FullProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 12; // Number of profiles to load per page

  // Create filter criteria for API calls
  const filterCriteria = useMemo(() => ({
    profileTypes: data.profileType?.map((type: any) => type.name) || [],
    units: data.unit?.map((unit: any) => unit.id) || [],
    researchAreas: data.researchArea?.map((area: any) => area.name) || []
  }), [data.profileType, data.unit, data.researchArea]);

  // Fetch profiles function
  const fetchProfiles = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      // Add filter parameters if they exist
      if (filterCriteria.units.length > 0) {
        filterCriteria.units.forEach((unitId: string) => params.append('units', unitId));
      }
      if (filterCriteria.profileTypes.length > 0) {
        filterCriteria.profileTypes.forEach((type: string) => params.append('types', type));
      }
      if (filterCriteria.researchAreas.length > 0) {
        filterCriteria.researchAreas.forEach((area: string) => params.append('research', area));
      }

      const response = await fetch(`/api/profiles?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profiles: ${response.statusText}`);
      }

      const result = await response.json();
      const fetchedProfiles = result.results || [];
      
      if (append) {
        setProfiles(prev => {
          // Deduplicate by ID when appending
          const existingIds = new Set(prev.map(p => p.id));
          const newProfiles = fetchedProfiles.filter((p: FullProfile) => !existingIds.has(p.id));
          return [...prev, ...newProfiles];
        });
      } else {
        setProfiles(fetchedProfiles);
      }
      
      // Simple logic: if we got fewer profiles than requested, there are no more
      setHasMore(fetchedProfiles.length === pageSize);
      setCurrentPage(page);

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('ProfileBlock - Fetched profiles:', {
          page,
          append,
          fetchedCount: fetchedProfiles.length,
          hasMoreAfterFetch: fetchedProfiles.length === pageSize
        });
      }

    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
      if (!append) {
        setProfiles([]);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filterCriteria, pageSize]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      // Calculate the next page based on current profiles count
      const nextPage = Math.floor(profiles.length / pageSize);
      fetchProfiles(nextPage, true);
    }
  }, [fetchProfiles, profiles.length, pageSize, hasMore, isLoadingMore]);

  // Initial load and reload when filter criteria change
  useEffect(() => {
    // Reset state when criteria change
    setProfiles([]);
    setCurrentPage(0);
    setHasMore(true);
    
    // Use initial data if available, otherwise fetch from API
    if (data.profiles && data.profiles.length > 0) {
      const uniqueProfiles = new Map();
      data.profiles.forEach((profile: any) => {
        if (profile.id && !uniqueProfiles.has(profile.id)) {
          uniqueProfiles.set(profile.id, profile);
        }
      });
      
      const initialProfiles = Array.from(uniqueProfiles.values());
      setProfiles(initialProfiles);
      setIsLoading(false);
      
      // Assume there might be more profiles available if we have a full pageSize
      setHasMore(initialProfiles.length >= pageSize);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ProfileBlock - Using pre-fetched profiles:', {
          initialCount: initialProfiles.length,
          assumeHasMore: initialProfiles.length >= pageSize
        });
      }      
    } else {
      fetchProfiles(0, false);
    }
  }, [filterCriteria, fetchProfiles, data.profiles, pageSize]);

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
      
      <Container>
        {/* Loading message overlay /}
        {isLoading && (
          <div className="flex w-full items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Loading profiles...</span>
            </div>
          </div>
        )}

        <ProfileGrid
          profiles={profiles}
          gridClasses="grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]"
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isLoadingMore={isLoadingMore}
        />
        
        {/* No results were found - only show when not loading /}
        {!isLoading && profiles.length === 0 && !error && (
          <div className="flex w-full items-center justify-center py-8">
            <Typography type="body" className="text-black/50">
              No profiles found.
            </Typography>
          </div>
        )}

        {/* Error message /}
        {error && (
          <div className="flex w-full items-center justify-center py-8">
            <Typography type="body" className="text-red-600">
              {error}
            </Typography>
          </div>
        )}
      </Container>
    </>
  );
   */
  return <></>;
};
