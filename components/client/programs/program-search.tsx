"use client";

import { useMemo, useState } from "react";
import { useFuzzySearch } from "@/lib/use-fuzzy-search";
import { TextInput } from "@uoguelph/react-components/text-input";
import { ProgramGrid } from "@/components/client/programs/program-grid";
import { ProgramSearchNavigation } from "@/components/client/programs/program-search-navigation";
import { Container } from "@uoguelph/react-components/container";
import { Select, SelectOptions, SelectButton, SelectOption } from "@uoguelph/react-components/select";
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
import { pluginQPS } from "@orama/plugin-qps";
import { Field, Label } from "@headlessui/react";

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

export const ProgramSearch = ({ programs, types, degreeTypes, useDegreeAcronym = false }: ProgramSearchProps) => {
  const [input, setInput] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ProgramType[]>(types);

  // The fuzzy search function
  const search = useFuzzySearch({
    schema: {
      id: "string",
      title: "string",
      tags: "string[]",
    },
    data: programs,
    plugins: [pluginQPS()],
    stopwords: ["development"],
  });

  const fuzzyMatches = useMemo(() => {
    if (input === "") return programs;

    const results = search({
      term: input,
      properties: ["title", "tags"],
      boost: {
        title: 2,
      },
      tolerance: 1,
    });

    // console.log(`Found ${results.count} results in ${results.elapsed.formatted}`);

    return results.hits.map((hit) => hit.document as Program);
  }, [input, programs, search]);

  const filtered = useMemo(() => {
    if (selectedTypes.length === 0) return fuzzyMatches;

    return fuzzyMatches.filter((program) => {
      if (Array.isArray(program.type)) {
        return program.type.some((type) => selectedTypes.some((t) => t.id === type.id));
      }

      // @ts-ignore
      return selectedTypes.some((type) => type.id === program.type.id);
    });
  }, [fuzzyMatches, selectedTypes]);

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
        <ProgramSearchNavigation />
      </Container>

      <div className="w-full bg-yellow -mt-1">
        <Container className="w-full bg-yellow flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end">
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

          <Field className="sm:w-1/3 md:w-1/4">
            <Label className="text-body-copy-bold font-bold">Filter by type</Label>
            <Select
              value={selectedTypes}
              multiple
              onChange={(value) => {
                setSelectedTypes(value);
              }}
              as="div"
            >
              <SelectButton>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {(selectedTypes.length > 0 ? selectedTypes : types).map((type) => type.name).join(", ")}
                </span>
              </SelectButton>
              <SelectOptions>
                {types.map((type) => (
                  <SelectOption value={type} key={type.id}>
                    {type.name}
                  </SelectOption>
                ))}
              </SelectOptions>
            </Select>
          </Field>
        </Container>
      </div>

      <Container>
        <ProgramGrid programs={filtered} useDegreeAcronym={useDegreeAcronym} />

        {/* No results were found */}
        {filtered.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl font-bold text-black/50">No programs matching your criteria were found.</span>
          </div>
        )}
      </Container>
    </div>
  );
};
