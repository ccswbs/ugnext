"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Field, Label } from "@headlessui/react";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type {
  UndergraduateAdmissionLocation,
  UndergraduateAdmissionLocationType,
  UndergraduateAdmissionStudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import { Fragment, SubmitEventHandler, useEffect, useMemo, useState, useTransition } from "react";
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
import { RadioGroup, Radio } from "@uoguelph/react-components/radio-group";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";

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

  const [isPending, startTransition] = useTransition();

  const programSearch = useFuzzySearch({
    schema: {
      id: "string",
      title: "string",
      tags: "string[]",
    },
    data: programs,
    stemming: true,
    plugins: [pluginQPS()],
  });

  const filteredPrograms = useMemo(() => {
    if (programQuery === "") return programs;

    const results = programSearch({
      term: programQuery,
      properties: ["title", "tags"],
      boost: {
        title: 4,
      },
      tolerance: 2,
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

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!url) return;

    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed top-0 left-0 w-screen z-10000 h-screen bg-white flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}

      <form className="w-full flex flex-col" onSubmit={onSubmit}>
        <Field>
          <Label>
            <Typography type={"h3"} as={"h2"}>
              I am a
            </Typography>
          </Label>

          <Select value={studentType} multiple={false} onChange={setStudentType}>
            <SelectButton>{studentType ? studentType.name : <span>&nbsp;</span>}</SelectButton>

            <SelectOptions anchor="bottom">
              {studentTypes
                .sort((a, b) => a.weight - b.weight)
                .map((type) => (
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
            </SelectOptions>
          </Select>
        </Field>

        {locationType === "domestic" && (
          <Field>
            <Label>
              <Typography type={"h3"} as={"h2"}>
                My province/territory of study is/was
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
                  .filter((location) => location.type === "domestic")
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

        {locationType && locationType !== "domestic" && (
          <>
            <Typography type={"h3"} as={"h2"}>
              My Curriculum or Country of study is/was
            </Typography>

            <Field>
              <Label>
                <Typography type={"h3"} as={"h3"}>
                  Curriculum
                </Typography>
              </Label>

              <RadioGroup onChange={setLocation} value={location?.type === "curriculum" ? location : null} by="name">
                {locations
                  .filter((location) => location.type === "curriculum")
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((loc) => (
                    <Radio key={loc.id} value={loc}>
                      {loc.name}
                    </Radio>
                  ))}
              </RadioGroup>
            </Field>

            <Typography type={"h3"} as={"span"}>
              or
            </Typography>

            <Field>
              <Label>
                <Typography type={"h3"} as={"h3"}>
                  Country
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
                  displayValue={(selected: UndergraduateAdmissionLocation | null) =>
                    selected?.type === "international" ? (selected?.name ?? "") : ""
                  }
                />

                <AutocompleteOptions anchor="bottom" className="max-h-[20rem]!">
                  {locations
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .filter((location) => location.type === "international")
                    .filter((location) => location.name.toLowerCase().includes(locationQuery))
                    .map((location) => (
                      <AutocompleteOption key={location.id} value={location} className="flex flex-col">
                        {location.name}
                      </AutocompleteOption>
                    ))}
                </AutocompleteOptions>
              </Autocomplete>
            </Field>
          </>
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
              {filteredPrograms
                .sort((a, b) => (a.degree?.title ?? "").localeCompare(b.degree?.title ?? ""))
                .map((program, index) => {
                  const showDegree =
                    program.degree?.title && filteredPrograms[index - 1]?.degree?.title !== program.degree?.title;

                  return (
                    <Fragment key={program.id}>
                      {showDegree && (
                        <div className="peer uofg-degree-title p-2 w-full text-grey-dark font-bold border-y border-grey-dark">
                          {program?.degree?.title}
                        </div>
                      )}
                      <AutocompleteOption value={program} className="pl-6 border-grey-light border-b">
                        {program.title}
                      </AutocompleteOption>
                    </Fragment>
                  );
                })}
            </AutocompleteOptions>
          </Autocomplete>
        </Field>

        <Button type="submit" disabled={!url || isPending} className="w-fit mt-8">
          View Requirements
        </Button>
      </form>
    </>
  );
}
