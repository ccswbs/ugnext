"use client";

import { useState, useEffect, useCallback } from "react";
import { FullProfile } from "@/lib/types/profile";

interface SearchFilters {
  searchTerm?: string;
  unitIds?: string[];
}

interface SearchState {
  results: FullProfile[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error?: string;
  total: number;
  currentPage: number;
  hasMore: boolean;
}

// Pagination response interface
interface PaginationResponse {
  results: FullProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Client-side API functions that don't use next/headers
const fetchProfilesPaginated = async (page: number = 0, pageSize: number = 20, searchTerm?: string): Promise<PaginationResponse> => {
  try {
    let url = `/api/profiles?page=${page}&pageSize=${pageSize}`;
    if (searchTerm && searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return {
      results: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }
};

const fetchProfilesByUnitPaginated = async (unitId: string, page: number = 0, pageSize: number = 20, searchTerm?: string): Promise<PaginationResponse> => {
  try {
    let url = `/api/profiles/unit/${unitId}?page=${page}&pageSize=${pageSize}`;
    if (searchTerm && searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch profiles for unit ${unitId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching profiles for unit ${unitId}:`, error);
    return {
      results: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }
};

/**
 * Client-side search function that works with profile data
 */
export const searchProfilesByName = (profiles: FullProfile[], searchTerm: string): FullProfile[] => {
  if (!searchTerm || searchTerm.trim() === '') return profiles;
  
  const searchTermLower = searchTerm.toLowerCase().trim();
  
  return profiles.filter(profile => {
    const firstName = (profile.profileFirstName || '').toLowerCase();
    const lastName = (profile.profileLastName || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    const title = (profile.title || '').toLowerCase();
    const jobTitle = (profile.profileJobTitle || '').toLowerCase();
    
    return fullName.includes(searchTermLower) || 
           firstName.includes(searchTermLower) ||
           lastName.includes(searchTermLower) ||
           title.includes(searchTermLower) || 
           jobTitle.includes(searchTermLower);
  });
};

/**
 * Filter profiles by unit IDs
 */
export const filterProfilesByUnits = (profiles: FullProfile[], unitIds: string[]): FullProfile[] => {
  if (!unitIds || unitIds.length === 0) return profiles;
  
  return profiles.filter(profile => {
    if (!profile.profileUnit) return false;
    
    const profileUnitArray = Array.isArray(profile.profileUnit) 
      ? profile.profileUnit 
      : [profile.profileUnit];
    
    return profileUnitArray.some(unit => unitIds.includes(unit.id));
  });
};

/**
 * Hook for searching profiles with server-side unit filtering and client-side name search
 * Supports pagination with "load more" functionality
 */
export const useProfileSearch = (filters: SearchFilters = {}) => {
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    isLoading: false,
    isLoadingMore: false,
    total: 0,
    currentPage: 0,
    hasMore: false,
  });

  const performSearch = useCallback(async (page: number = 0, append: boolean = false) => {
    if (append) {
      setSearchState(prev => ({ ...prev, isLoadingMore: true, error: undefined }));
    } else {
      setSearchState(prev => ({ ...prev, isLoading: true, error: undefined, results: [], currentPage: 0 }));
    }

    try {
      let paginationResult: PaginationResponse;

      // If we have a search term, disable regular pagination and fetch more results
      if (filters.searchTerm && filters.searchTerm.trim()) {
        
        // When searching, we need to fetch ALL profiles to search through
        if (filters.unitIds && filters.unitIds.length > 0) {
          // For multiple units, fetch ALL profiles from each unit
          const profilePromises = filters.unitIds.map(unitId => 
            fetchProfilesByUnitPaginated(unitId, 0, 1000, filters.searchTerm)
          );
          const profileResults = await Promise.all(profilePromises);
          
          // Combine results from all units and remove duplicates
          const allProfiles = profileResults.flatMap(result => result.results);
          const totalResults = profileResults.reduce((sum, result) => sum + result.total, 0);
          
          // Remove duplicates based on profile ID
          const uniqueProfiles = allProfiles.filter((profile, index, self) => 
            index === self.findIndex(p => p.id === profile.id)
          );
          
          paginationResult = {
            results: uniqueProfiles,
            total: totalResults,
            page: 0,
            pageSize: uniqueProfiles.length,
            totalPages: 1,
          };
        } else {
          // Let the server handle the search with the contextual filter
          paginationResult = await fetchProfilesPaginated(0, 100, filters.searchTerm);
        }
      } else {
        // Regular pagination when not searching
        if (filters.unitIds && filters.unitIds.length > 0) {
          // For multiple units, we need to fetch each one and combine results
          const profilePromises = filters.unitIds.map(unitId => 
            fetchProfilesByUnitPaginated(unitId, page, 20)
          );
          const profileResults = await Promise.all(profilePromises);
          
          // Combine results from all units and remove duplicates
          const allProfiles = profileResults.flatMap(result => result.results);
          const totalResults = profileResults.reduce((sum, result) => sum + result.total, 0);
          
          // Remove duplicates based on profile ID
          const uniqueProfiles = allProfiles.filter((profile, index, self) => 
            index === self.findIndex(p => p.id === profile.id)
          );
          
          paginationResult = {
            results: uniqueProfiles,
            total: totalResults,
            page,
            pageSize: 20,
            totalPages: Math.ceil(totalResults / 20),
          };
        } else {
          // Fetch all profiles if no unit filter
          paginationResult = await fetchProfilesPaginated(page, 20);
        }
      }

      const filteredProfiles = paginationResult.results;

      setSearchState(prev => ({
        results: append ? [...prev.results, ...filteredProfiles] : filteredProfiles,
        isLoading: false,
        isLoadingMore: false,
        total: filters.searchTerm?.trim() ? filteredProfiles.length : paginationResult.total,
        currentPage: page,
        hasMore: page < paginationResult.totalPages - 1,
      }));
    } catch (error) {
      console.error('Profile search error:', error);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        isLoadingMore: false,
        error: 'Failed to search profiles',
      }));
    }
  }, [filters.unitIds, filters.searchTerm]);

  const loadMore = useCallback(() => {
    // Don't allow load more when searching - search shows all matching results
    if (filters.searchTerm && filters.searchTerm.trim()) {
      return;
    }
    
    if (searchState.hasMore && !searchState.isLoadingMore) {
      performSearch(searchState.currentPage + 1, true);
    }
  }, [performSearch, searchState.currentPage, searchState.hasMore, searchState.isLoadingMore, filters.searchTerm]);

  // Trigger search when filters change
  useEffect(() => {
    performSearch(0, false);
  }, [performSearch]);

  const reset = useCallback(() => {
    setSearchState({
      results: [],
      isLoading: false,
      isLoadingMore: false,
      total: 0,
      currentPage: 0,
      hasMore: false,
    });
  }, []);

  return {
    ...searchState,
    refresh: () => performSearch(0, false),
    loadMore,
    reset,
  };
};



/**
 * Hook specifically for faculty search with debounced search term
 */
export const useFacultySearch = (searchTerm: string = '', unitIds: string[] = []) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return useProfileSearch({
    searchTerm: debouncedSearchTerm,
    unitIds: unitIds.length > 0 ? unitIds : undefined,
  });
};