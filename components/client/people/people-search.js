"use client";

import { PeopleSearchBar } from "./people-search-bar";
// import { ProgramSearchNavigation } from "./program-search-navigation";
import { ProfileGrid } from "./profile-grid";
import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";

export const PeopleSearch = ({ profiles, types, units }) => {
  const [filteredPeople, setFilteredPeople] = useState(profiles);

  return (
    <div className="flex flex-col relative">
    {/* <Container className="py-0!">
        <ProgramSearchNavigation />
    </Container> */}

      <PeopleSearchBar
        profiles={profiles}
        types={types}
        units={units}
        onChange={(filtered) => setFilteredPeople(filtered)}
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
