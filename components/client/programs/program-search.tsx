"use client";

import { ProgramSearchBar } from "./program-search-bar";
import { ProgramSearchNavigation } from "./program-search-navigation";
import { ProgramGrid } from "./program-grid";
import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";
import type { Program } from "@/components/client/programs/program-card";
import type { UndergraduateProgramType } from "@/data/drupal/undergraduate-program";
import type { GraduateDegreeType, GraduateProgramType } from "@/data/yaml/programs/graduate";
import type { CertificateAndDiplomaProgramType } from "@/data/yaml/programs/certificate-and-diploma";
import type { ContinuingEducationProgramType } from "@/data/yaml/programs/continuing-education";
import type { UndergraduateDegreeType } from "@/data/drupal/undergraduate-degree";

type ProgramType =
  | UndergraduateProgramType
  | GraduateProgramType
  | CertificateAndDiplomaProgramType
  | ContinuingEducationProgramType;

type DegreeType = UndergraduateDegreeType | GraduateDegreeType;

export const ProgramSearch = ({
  programs,
  types,
  degreeTypes,
  useDegreeAcronym = false,
}: {
  programs: Program[];
  types: ProgramType[];
  degreeTypes?: DegreeType[];
  useDegreeAcronym?: boolean;
}) => {
  const [filteredPrograms, setFilteredPrograms] = useState(programs);

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
        <ProgramSearchNavigation />
      </Container>

      <Container>
        <ProgramGrid programs={filteredPrograms} useDegreeAcronym={useDegreeAcronym} />

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
