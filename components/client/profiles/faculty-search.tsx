"use client";

import { FacultySearchBar } from "@/components/client/profiles/faculty-search-bar";
import { ProfileGrid } from "@/components/client/profiles/profile-grid";
import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";
import { useFacultySearch } from "@/lib/use-profile-search";

interface FacultySearchProps {
  units: any[];    // Replace 'any[]' with the actual type if known
}

export const FacultySearch = ({ units }: FacultySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  
  // Use the search hook directly instead of going through the search bar
  const { 
    results, 
    isLoading, 
    isLoadingMore, 
    total, 
    hasMore, 
    loadMore, 
    error 
  } = useFacultySearch(searchTerm, selectedUnits);

  const handleFilterChange = (term: string, units: string[]) => {
    setSearchTerm(term);
    setSelectedUnits(units);
  };

  return (
    <div className="flex flex-col relative">

      <FacultySearchBar
        units={units}
        onSearchChange={handleFilterChange}
      />

      <Container>
        {/* Loading message overlay */}
        {isLoading && (
          <div className="flex w-full items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">
                {searchTerm.trim() ? 'Searching all faculty profiles...' : 'Loading faculty profiles...'}
              </span>
            </div>
          </div>
        )}

        <ProfileGrid 
          profiles={results} 
          gridClasses="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          isLoading={isLoading}
          totalResults={total}
          hasMore={hasMore && !searchTerm.trim()}
          onLoadMore={loadMore}
          isLoadingMore={isLoadingMore}
        />
                
        {/* No results were found - only show when not loading */}
        {!isLoading && results?.length === 0 && (
          <div className="flex w-full items-center justify-center py-8">
            <span className="text-xl font-bold text-black/50">No people matching your criteria were found.</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex w-full items-center justify-center py-8">
            <span className="text-xl font-bold text-red-600">{error}</span>
          </div>
        )}
      </Container>
    </div>
  );
};
