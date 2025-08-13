"use client";

import { PeopleSearchBar } from "./people-search-bar";
import { PeopleSearchNavigation } from "./people-search-navigation";
import { ProfileGrid } from "./profile-grid";
import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";

export const PeopleSearch = ({ profiles, types, units }) => {
  const [filteredPeople, setFilteredPeople] = useState(profiles);

  const handleFilterChange = (filtered) => {
    setFilteredPeople(filtered);
  };

  return (
    <div className="flex flex-col relative">
    <Container className="py-0!">
        <PeopleSearchNavigation />
    </Container>

      <PeopleSearchBar
        profiles={profiles}
        types={types}
        units={units}
        onChange={handleFilterChange}
      />

      <Container>
        <ProfileGrid 
          profiles={filteredPeople} 
          gridClasses="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        />
                
        {/* No results were found */}
        {filteredPeople?.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl font-bold text-black/50">No people matching your criteria were found.</span>
          </div>
        )}
      </Container>
    </div>
  );
};
