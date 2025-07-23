"use client";

import { useEffect, useMemo, useState } from "react";
import { useFuzzySearch } from "@/lib/use-fuzzy-search";
import { TextInput } from "@uoguelph/react-components/text-input";
import { ProgramGrid } from "@/components/client/programs/program-grid";
import { ProgramSearchNavigation } from "@/components/client/programs/program-search-navigation";
import { Container } from "@uoguelph/react-components/container";
import type { UndergraduateProgram, UndergraduateProgramType } from "@/data/drupal/undergraduate-program";
import type { UndergraduateDegree, UndergraduateDegreeType } from "@/data/drupal/undergraduate-degree";
import type { GraduateDegreeType, GraduateProgram, GraduateProgramType } from "@/data/yaml/programs/graduate";
import type {
  CertificateAndDiplomaProgram,
  CertificateAndDiplomaProgramType,
} from "@/data/yaml/programs/certificate-and-diploma";
import type {
  ContinuingEducationProgram,
  ContinuingEducationProgramType,
} from "@/data/yaml/programs/continuing-education";

export type ProgramType =
  | UndergraduateProgramType
  | UndergraduateDegreeType
  | GraduateProgramType
  | CertificateAndDiplomaProgramType
  | ContinuingEducationProgramType;

export type DegreeType = UndergraduateDegreeType | GraduateDegreeType;

export type Program =
  | UndergraduateProgram
  | UndergraduateDegree
  | GraduateProgram
  | CertificateAndDiplomaProgram
  | ContinuingEducationProgram;

type ProgramSearchProps = {
  programs: Program[];
  types: ProgramType[];
  degreeTypes?: DegreeType[];
  useDegreeAcronym?: boolean;
};

const ProgramSearchSchema = {
  id: "string",
  title: "string",
  tags: "string[]",
} as const;

const defaultParams = {
  properties: ["title", "tags"],
  boost: {
    title: 2,
  },
  tolerance: 1,
};

export const ProgramSearch = ({ programs, types, degreeTypes, useDegreeAcronym = false }: ProgramSearchProps) => {
  const [input, setInput] = useState("");

  // The fuzzy search function
  const search = useFuzzySearch({
    schema: ProgramSearchSchema,
    data: programs,
  });

  const filtered = useMemo(() => {
    const results = search({
      term: input,
      properties: ["title", "tags"],
      boost: {
        title: 2,
      },
      tolerance: 1,
    });

    return results.hits.map((hit) => hit.document as Program);
  }, [input, search]);

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
        <ProgramSearchNavigation />
      </Container>

      <div className="w-full bg-yellow -mt-1">
        <Container className="bg-yellow flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              placeholder="ex. programming, engineering, psychology, etc."
              onInput={(e) => {
                setInput((e.target as HTMLInputElement).value);
              }}
            >
              <span className="text-l font-bold mb-1">What would you like to study?</span>
            </TextInput>
          </div>
        </Container>
      </div>

      <Container>
        <ProgramGrid programs={input === "" ? programs : filtered} useDegreeAcronym={useDegreeAcronym} />

        {/* No results were found */}
        {filtered?.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl font-bold text-black/50">No programs matching your criteria were found.</span>
          </div>
        )}
      </Container>
    </div>
  );
};
