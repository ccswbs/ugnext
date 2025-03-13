import { ProgramSearchBar } from "@/components/programs/program-search-bar";
import { ProgramSearchNavigation } from "@/components/programs/program-search-navigation";
import { ProgramGrid } from "@/components/programs/program-grid";
import { useState } from "react";

export const ProgramSearch = ({ programs, types, degreeTypes, condensedDegrees = false }) => {
  const [filteredPrograms, setFilteredPrograms] = useState(programs);

  return (
    <div className="flex flex-col relative">
    
      <ProgramSearchNavigation />

      <ProgramSearchBar
        programs={programs}
        types={types}
        degreeTypes={degreeTypes}
        onChange={(filtered) => setFilteredPrograms(filtered)}
      />

      <ProgramGrid programs={filteredPrograms} condensedDegrees={condensedDegrees} />

      {/* No results were found */}
      {filteredPrograms?.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <span className="text-xl font-bold text-black/50">No programs matching your criteria were found.</span>
        </div>
      )}
    </div>
  );
};
