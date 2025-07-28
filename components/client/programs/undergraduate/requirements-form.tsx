"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Field, Label } from "@headlessui/react";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type {
  UndergraduateAdmissionLocation,
  UndergraduateAdmissionLocationType,
  UndergraduateAdmissionStudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import { useEffect, useMemo, useState } from "react";
import { Select, SelectButton, SelectOption, SelectOptions } from "@uoguelph/react-components/select";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteOption,
  AutocompleteOptions,
} from "@uoguelph/react-components/autocomplete";
import { useFuzzySearch } from "@/lib/use-fuzzy-search";
import { pluginQPS } from "@orama/plugin-qps";
import { toTitleCase } from "@/lib/string-utils";

type RequirementsFormProps = {
  studentTypes: UndergraduateAdmissionStudentType[];
  locations: UndergraduateAdmissionLocation[];
  programs: UndergraduateProgram[];
};

export default function RequirementsForm({ studentTypes, locations, programs }: RequirementsFormProps) {
  const [studentType, setStudentType] = useState<UndergraduateAdmissionStudentType | null>(null);

  const [locationQuery, setLocationQuery] = useState<string>("");
  const [location, setLocation] = useState<UndergraduateAdmissionLocation | null>(null);

  const [programQuery, setProgramQuery] = useState<string>("");
  const [program, setProgram] = useState<UndergraduateProgram | null>(null);

  const programSearch = useFuzzySearch({
    schema: {
      id: "string",
      title: "string",
      tags: "string[]",
    },
    data: programs,
    plugins: [pluginQPS()],
    stopwords: ["development"],
  });

  const filteredPrograms = useMemo(() => {
    if (programQuery === "") return programs;

    const results = programSearch({
      term: programQuery,
      properties: ["title", "tags"],
      boost: {
        title: 2,
      },
      tolerance: 1,
    });

    return results.hits.map((hit) => hit.document as UndergraduateProgram);
  }, [programQuery, programSearch, programs]);

  useEffect(() => {
    console.log(studentType, location, program);
  }, [location, program, studentType]);

  return (
    <form className="w-2/3 flex flex-col">
      <Field>
        <Label>
          <Typography type={"h3"} as={"h2"}>
            I am a
          </Typography>
        </Label>

        <Select value={studentType} multiple={false} onChange={setStudentType}>
          <SelectButton>{studentType ? studentType.name : <span>&nbsp;</span>}</SelectButton>

          <SelectOptions anchor="bottom">
            {studentTypes.map((type) => (
              <SelectOption key={type.id} value={type}>
                {type.name}
              </SelectOption>
            ))}
          </SelectOptions>
        </Select>
      </Field>

      <Field>
        <Label>
          <Typography type={"h3"} as={"h2"}>
            I attend/attended high school in
          </Typography>
        </Label>

        <Autocomplete
          value={location}
          multiple={false}
          onClose={() => setLocationQuery("")}
          onChange={setLocation}
          immediate
        >
          <AutocompleteInput
            onChange={(event) => setLocationQuery(event.target.value.toLowerCase())}
            displayValue={(selected: UndergraduateAdmissionLocation | null) => selected?.name ?? ""}
          />

          <AutocompleteOptions anchor="bottom" className="max-h-[20rem]!">
            {locations
              .filter((location) => location.name.toLowerCase().includes(locationQuery))
              .map((location) => (
                <AutocompleteOption key={location.id} value={location} className="flex flex-col">
                  <div>{location.name}</div>
                  <span className="text-sm">{toTitleCase(location.type)}</span>
                </AutocompleteOption>
              ))}
          </AutocompleteOptions>
        </Autocomplete>
      </Field>

      <Field>
        <Label>
          <Typography type={"h3"} as={"h2"}>
            I am interested in studying
          </Typography>
        </Label>

        <Autocomplete
          value={program}
          multiple={false}
          onClose={() => setProgramQuery("")}
          onChange={setProgram}
          immediate
        >
          <AutocompleteInput
            onChange={(event) => setProgramQuery(event.target.value.toLowerCase())}
            displayValue={(selected: UndergraduateProgram | null) => selected?.title ?? ""}
          />

          <AutocompleteOptions anchor="bottom" className="max-h-[20rem]!">
            {filteredPrograms.map((program) => (
              <AutocompleteOption key={program.id} value={program}>
                {program.title}
              </AutocompleteOption>
            ))}
          </AutocompleteOptions>
        </Autocomplete>
      </Field>
    </form>
  );
}
