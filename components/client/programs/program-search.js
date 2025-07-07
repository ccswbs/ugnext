"use client";

import { ProgramSearchBar } from "./program-search-bar";
import { ProgramSearchNavigation } from "./program-search-navigation";
import { ProgramGrid } from "./program-grid";
import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";

export const ProgramSearch = ({ programs, types, degreeTypes, condensedDegrees = false }) => {
  const [filteredPrograms, setFilteredPrograms] = useState(programs);

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
        <ProgramSearchNavigation />
      </Container>

      <ProgramSearchBar
        programs={programs}
        types={types}
        degreeTypes={degreeTypes}
        onChange={(filtered) => setFilteredPrograms(filtered)}
      />

      <Container>
        <ProgramGrid programs={filteredPrograms} condensedDegrees={condensedDegrees} />

        {/* No results were found */}
        {filteredPrograms?.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl font-bold text-black/50">No programs matching your criteria were found.</span>
          </div>
        )}
      </Container>
    </div>
  );
};
