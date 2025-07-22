"use client";

import { FacultySearchBar } from "./faculty-search-bar";
import { PeopleSearchNavigation } from "./people-search-navigation";
import { ProfileGrid } from "./profile-grid";
import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";

interface FacultySearchProps {
  profiles: any[]; // Replace 'any[]' with the actual type if known
  tags: any[];    // Replace 'any[]' with the actual type if known
  units: any[];    // Replace 'any[]' with the actual type if known
}

export const FacultySearch = ({ profiles, tags, units }: FacultySearchProps) => {
  const [filteredPeople, setFilteredPeople] = useState(profiles);

  const handleFilterChange = (filtered: typeof profiles) => {
    setFilteredPeople(filtered);
  };

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
        <PeopleSearchNavigation />
      </Container>

      <FacultySearchBar
        profiles={profiles}
        tags={tags}
        units={units}
        onChange={handleFilterChange}
      />

      <Container>
        <ProfileGrid profiles={filteredPeople} />
                
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
