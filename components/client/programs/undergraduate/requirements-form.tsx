"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Field, Label } from "@headlessui/react";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteOptions,
  AutocompleteOption,
} from "@uoguelph/react-components/autocomplete";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type {
  AdmissionLocation,
  AdmissionLocationType,
  StudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import { useEffect, useState } from "react";

type RequirementsFormProps = {
  studentTypes: StudentType[];
  locations: AdmissionLocation[];
  programs: UndergraduateProgram[];
};

export default function RequirementsForm({ studentTypes, locations, programs }: RequirementsFormProps) {
  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [locationType, setLocationType] = useState<AdmissionLocationType>("domestic");
  const [location, setLocation] = useState<AdmissionLocation | null>(null);
  const [program, setProgram] = useState<UndergraduateProgram | null>(null);

  useEffect(() => {
    console.log(studentType, location, program);
  }, [location, program, studentType]);

  return (
    <form>
      <Field>
        <Label>
          <Typography type={"h3"} as={"h2"}>
            I am a
          </Typography>
        </Label>
      </Field>

      <Field>
        <Label>
          <Typography type={"h3"} as={"h2"}>
            I attend/attended high school in
          </Typography>
        </Label>
      </Field>

      {locationType === "international" && (
        <Field>
          <Label>
            <Typography type={"h3"} as={"h2"}>
              I study/studied in
            </Typography>
          </Label>
        </Field>
      )}

      {locationType === "curriculum" && (
        <Field>
          <Label>
            <Typography type={"h3"} as={"h2"}>
              My curriculum of study is/was
            </Typography>
          </Label>
        </Field>
      )}

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
