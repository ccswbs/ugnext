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
import { Button } from "@uoguelph/react-components/button";
import { useRouter } from "next/navigation";
import {
  UNDERGRADUATE_ADMISSION_LOCATIONS_NODE_PATH,
  UNDERGRADUATE_ADMISSION_STUDENT_TYPE_NODE_PATH,
  UNDERGRADUATE_PROGRAMS_NODE_PATH,
} from "@/lib/undergraduate-admission-requirements";

type AdmissionRequirementsFormProps = {
  studentTypes: UndergraduateAdmissionStudentType[];
  locations: UndergraduateAdmissionLocation[];
  programs: UndergraduateProgram[];
};

export default function AdmissionRequirementsForm({
  studentTypes,
  locations,
  programs,
}: AdmissionRequirementsFormProps) {
  const router = useRouter();

  const [studentType, setStudentType] = useState<UndergraduateAdmissionStudentType | null>(null);

  const [locationType, setLocationType] = useState<UndergraduateAdmissionLocationType | null>(null);
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

  const url = useMemo(() => {
    if (!studentType || !location || !program) return null;

    const studentTypePath = studentType.path?.replace(UNDERGRADUATE_ADMISSION_STUDENT_TYPE_NODE_PATH, "");
    const locationPath = location.path?.replace(UNDERGRADUATE_ADMISSION_LOCATIONS_NODE_PATH, "");
    const programPath = program.path?.replace(UNDERGRADUATE_PROGRAMS_NODE_PATH, "");

    return `/programs/undergraduate/requirements/${studentTypePath}/${locationPath}/${programPath}`;
  }, [studentType, location, program]);

  return (
    <form
      className="w-full flex flex-col"
      onSubmit={() => {
        if (url) {
          router.push(url);
        }
      }}
    >
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
            I attend/attended high school
          </Typography>
        </Label>

        <Select
          value={locationType}
          onChange={(type) => {
            setLocationType(type);
            setLocation(null);
            setLocationQuery("");
          }}
        >
          <SelectButton>
            {locationType === "domestic" && "Within Canada"}
            {locationType === "international" && "Outside of Canada"}
            {locationType === "curriculum" && "Under a Specific Curriculum of Study"}
            <span>&nbsp;</span>
          </SelectButton>

          <SelectOptions anchor="bottom">
            <SelectOption value="domestic">Within Canada</SelectOption>
            <SelectOption value="international">Outside of Canada</SelectOption>
            <SelectOption value="curriculum">Under a Specific Curriculum of Study</SelectOption>
          </SelectOptions>
        </Select>
      </Field>

      {locationType && (
        <Field>
          <Label>
            <Typography type={"h3"} as={"h2"}>
              {locationType === "domestic" && "My province/territory of study is/was"}
              {locationType === "international" && "My country of study is/was"}
              {locationType === "curriculum" && "My curriculum of study is/was"}
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
                .filter((location) => location.type === locationType)
                .filter((location) => location.name.toLowerCase().includes(locationQuery))
                .map((location) => (
                  <AutocompleteOption key={location.id} value={location} className="flex flex-col">
                    {location.name}
                  </AutocompleteOption>
                ))}
            </AutocompleteOptions>
          </Autocomplete>
        </Field>
      )}

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

      <Button type="submit" disabled={!url} className="w-fit mt-8">
        View Requirements
      </Button>
    </form>
  );
}
