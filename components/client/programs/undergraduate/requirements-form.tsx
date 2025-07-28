"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Field, Label } from "@headlessui/react";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type {
  AdmissionLocation,
  AdmissionLocationType,
  StudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import { useEffect, useState } from "react";
import { Select, SelectButton, SelectOption, SelectOptions } from "@uoguelph/react-components/select";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteOption,
  AutocompleteOptions,
} from "@uoguelph/react-components/autocomplete";

type RequirementsFormProps = {
  studentTypes: StudentType[];
  locations: AdmissionLocation[];
  programs: UndergraduateProgram[];
};

export default function RequirementsForm({ studentTypes, locations, programs }: RequirementsFormProps) {
  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [location, setLocation] = useState<AdmissionLocation | null>(null);
  const [program, setProgram] = useState<UndergraduateProgram | null>(null);

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
          <SelectButton>{studentType ? studentType.name : "Select a student type"}</SelectButton>

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
            displayValue={(selected: AdmissionLocation | null) => selected?.name ?? "Select or search a location"}
          />

          <AutocompleteOptions anchor="bottom" className="max-h-[20rem]!">
            {locations
              .filter((location) => location.name.toLowerCase().includes(locationQuery))
              .map((location) => (
                <AutocompleteOption key={location.id} value={location}>
                  {location.name}
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
      </Field>
    </form>
  );
}
