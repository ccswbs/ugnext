"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Field, Label } from "@headlessui/react";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type {
  UndergraduateAdmissionLocation,
  UndergraduateAdmissionLocationType,
  UndergraduateAdmissionStudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import {
  createContext,
  Fragment,
  SubmitEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
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
import { slugify } from "@/lib/string-utils";
import { twJoin } from "tailwind-merge";

type UndergraduateAdmissionRequirementsFormContextValue = {
  studentTypes: UndergraduateAdmissionStudentType[];
  studentType: UndergraduateAdmissionStudentType | null;
  setStudentType: (studentType: UndergraduateAdmissionStudentType | null) => void;

  locations: UndergraduateAdmissionLocation[];
  location: UndergraduateAdmissionLocation | null;
  setLocation: (location: UndergraduateAdmissionLocation | null) => void;

  programs: UndergraduateProgram[];
  program: UndergraduateProgram | null;
  setProgram: (program: UndergraduateProgram | null) => void;
};

const UndergraduateAdmissionRequirementsFormContext = createContext<UndergraduateAdmissionRequirementsFormContextValue>(
  {
    studentTypes: [],
    studentType: null,
    setStudentType: () => {},

    locations: [],
    location: null,
    setLocation: () => {},

    programs: [],
    program: null,
    setProgram: () => {},
  }
);

type UndergraduateAdmissionRequirementsFormProps = {
  studentTypes: UndergraduateAdmissionStudentType[];
  locations: UndergraduateAdmissionLocation[];
  programs: UndergraduateProgram[];
  isDomesticOnly?: boolean;
};

function UndergraduateAdmissionRequirementsStudentTypeField() {
  const { studentType, studentTypes, setStudentType } = useContext(UndergraduateAdmissionRequirementsFormContext);

  return (
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
  );
}

function UndergraduateAdmissionRequirementsLocationField() {
  const { setLocation } = useContext(UndergraduateAdmissionRequirementsFormContext);

  const [locationType, setLocationType] = useState<"international" | "domestic" | null>(null);

  useEffect(() => {
    setLocation(null);
  }, [locationType]);

  return (
    <>
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
          }}
        >
          <SelectButton>
            {locationType === "domestic" && "Within Canada"}
            {locationType === "international" && "Outside of Canada"}
            <span>&nbsp;</span>
          </SelectButton>

          <SelectOptions anchor="bottom">
            <SelectOption value="domestic">Within Canada</SelectOption>
            <SelectOption value="international">Outside of Canada</SelectOption>
          </SelectOptions>
        </Select>
      </Field>

      {locationType === "domestic" && <UndergraduateAdmissionRequirementsLocationDomesticField />}

      {locationType === "international" && (
        <>
          <Typography type={"h3"} as={"h2"} className="mb-0">
            Select a curriculum or country:
          </Typography>

          <UndergraduateAdmissionRequirementsLocationCurriculumField />

          <UndergraduateAdmissionRequirementsLocationInternationalField />
        </>
      )}
    </>
  );
}

function UndergraduateAdmissionRequirementsLocationDomesticField() {
  const { locations, location, setLocation } = useContext(UndergraduateAdmissionRequirementsFormContext);

  const domestic = useMemo(() => {
    return locations.filter((location) => location.type === "domestic");
  }, [locations]);

  const [query, setQuery] = useState("");

  return (
    <Field>
      <Label>
        <Typography type={"h3"} as={"h2"}>
          My province/territory of study is/was
        </Typography>
      </Label>

      <Autocomplete value={location} multiple={false} onClose={() => setQuery("")} onChange={setLocation} immediate>
        <AutocompleteInput
          onChange={(event) => setQuery(event.target.value.toLowerCase())}
          displayValue={(selected: UndergraduateAdmissionLocation | null) =>
            selected?.type === "domestic" ? (selected?.name ?? "") : ""
          }
        />

        <AutocompleteOptions anchor="bottom" className="max-h-50!">
          {domestic
            .filter((location) => location.name.toLowerCase().includes(query))
            .map((location) => (
              <AutocompleteOption key={location.id} value={location} className="flex flex-col">
                {location.name}
              </AutocompleteOption>
            ))}
        </AutocompleteOptions>
      </Autocomplete>
    </Field>
  );
}

function UndergraduateAdmissionRequirementsLocationInternationalField() {
  const { locations, location, setLocation } = useContext(UndergraduateAdmissionRequirementsFormContext);

  const international = useMemo(() => {
    return locations.filter((location) => location.type === "international");
  }, [locations]);

  const [query, setQuery] = useState("");

  return (
    <Field>
      <Label>
        <Typography type={"h3"} as={"h3"}>
          Country
        </Typography>
      </Label>

      <Autocomplete value={location} multiple={false} onClose={() => setQuery("")} onChange={setLocation} immediate>
        <AutocompleteInput
          onChange={(event) => setQuery(event.target.value.toLowerCase())}
          displayValue={(selected: UndergraduateAdmissionLocation | null) =>
            selected?.type === "international" ? (selected?.name ?? "") : ""
          }
        />

        <AutocompleteOptions anchor="bottom" className="max-h-50!">
          {international
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((location) => location.name.toLowerCase().includes(query))
            .map((location) => (
              <AutocompleteOption key={location.id} value={location} className="flex flex-col">
                {location.name}
              </AutocompleteOption>
            ))}
        </AutocompleteOptions>
      </Autocomplete>
    </Field>
  );
}

function UndergraduateAdmissionRequirementsLocationCurriculumField() {
  const { locations, location, setLocation } = useContext(UndergraduateAdmissionRequirementsFormContext);

  const curriculum = useMemo(() => {
    return locations.filter((location) => location.type === "curriculum");
  }, [locations]);

  return (
    <Field>
      <Label>
        <Typography type={"h3"} as={"h3"}>
          Curriculum
        </Typography>
      </Label>

      <RadioGroup onChange={setLocation} value={location?.type === "curriculum" ? location : null} by="name">
        {curriculum
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((loc) => (
            <Radio key={loc.id} value={loc}>
              {loc.name}
            </Radio>
          ))}
      </RadioGroup>
    </Field>
  );
}

function UndergraduateAdmissionRequirementsProgramField() {
  const { program, programs, setProgram } = useContext(UndergraduateAdmissionRequirementsFormContext);

  const search = useFuzzySearch({
    schema: {
      id: "string",
      title: "string",
      tags: "string[]",
    },
    data: programs,
    stemming: true,
    plugins: [pluginQPS()],
  });

  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    if (!query) {
      return programs;
    }

    const results = search({
      term: query,
      properties: ["title", "tags"],
      boost: {
        title: 4,
      },
      tolerance: 2,
    });

    return results.hits.map((hit) => hit.document as UndergraduateProgram);
  }, [query, search, programs]);

  const grouped = useMemo(() => {
    const grouped = new Map<string, UndergraduateProgram[]>();

    for (const program of filtered) {
      for (const degree of program.degree ?? []) {
        if (grouped.has(degree.title)) {
          grouped.get(degree.title)?.push(program);
        } else {
          grouped.set(degree.title, [program]);
        }
      }
    }

    return grouped
      .entries()
      .toArray()
      .map(([key, value]) => ({ degree: key, group: value }))
      .sort((a, b) => {
        const aStartsWithBachelor = a.degree.toLowerCase().startsWith("bachelor");
        const bStartsWithBachelor = b.degree.toLowerCase().startsWith("bachelor");

        if (aStartsWithBachelor && !bStartsWithBachelor) return -1;
        if (!aStartsWithBachelor && bStartsWithBachelor) return 1;

        return a.degree.localeCompare(b.degree);
      });
  }, [filtered]);

  return (
    <Field>
      <Label>
        <Typography type={"h3"} as={"h2"}>
          I am interested in studying
        </Typography>
      </Label>

      <Autocomplete
        value={program}
        multiple={false}
        onClose={() => setQuery("")}
        onChange={(p) => {
          setProgram(p);
        }}
        immediate
      >
        <AutocompleteInput
          onChange={(event) => setQuery(event.target.value.toLowerCase())}
          displayValue={(selected: UndergraduateProgram | null) => selected?.title ?? ""}
        />

        <AutocompleteOptions anchor="bottom" className="max-h-50!">
          {grouped.map(({ degree, group }) => {
            return (
              <Fragment key={degree}>
                <div className="peer uofg-degree-title p-2 w-full text-grey-dark font-bold border-y border-grey-dark">
                  {degree}
                </div>

                {group.map((p, index) => (
                  <AutocompleteOption
                    key={p.id}
                    value={p}
                    className={twJoin("pl-6 border-grey-light border-b", index === 0 && "scroll-m-10")}
                  >
                    {p.title}
                  </AutocompleteOption>
                ))}
              </Fragment>
            );
          })}
        </AutocompleteOptions>
      </Autocomplete>
    </Field>
  );
}

export default function UndergraduateAdmissionRequirementsForm({
  studentTypes,
  locations,
  programs,
  isDomesticOnly,
}: UndergraduateAdmissionRequirementsFormProps) {
  const router = useRouter();

  const [studentType, setStudentType] = useState<UndergraduateAdmissionStudentType | null>(null);
  const [location, setLocation] = useState<UndergraduateAdmissionLocation | null>(null);
  const [program, setProgram] = useState<UndergraduateProgram | null>(null);

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!studentType || !location || !program) {
      return;
    }

    // Hard-coded fallback for DVM
    if (Array.isArray(program.degree) && program.degree.some((degree) => degree.id === "5225")) {
      startTransition(() => {
        router.push("/ovc/dvm-program-application/");
      });

      return;
    }

    let url = "/programs/undergraduate/requirements";

    if (studentType.path) {
      url += `/${studentType.path.replace(UNDERGRADUATE_ADMISSION_STUDENT_TYPE_NODE_PATH, "")}`;
    } else {
      console.error(`Student type path is missing for ${studentType.name}`);
    }

    if (location.path) {
      url += `/${location.path.replace(UNDERGRADUATE_ADMISSION_LOCATIONS_NODE_PATH, "")}`;
    } else {
      console.error(`Location path is missing for ${location.name}`);
    }

    if (program.path) {
      url += `/${program.path.replace(UNDERGRADUATE_PROGRAMS_NODE_PATH, "")}`;
    } else {
      console.error(`Program path is missing for ${program.title}`);
    }

    startTransition(() => {
      router.push(url);
    });
  };

  if (isPending) {
    return (
      <div className="fixed top-0 left-0 w-screen z-10000 h-screen bg-white flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <UndergraduateAdmissionRequirementsFormContext.Provider
      value={{
        studentTypes,
        studentType,
        setStudentType,

        locations,
        location,
        setLocation,

        programs,
        program,
        setProgram,
      }}
    >
      <form className="w-full flex flex-col" onSubmit={onSubmit}>
        <UndergraduateAdmissionRequirementsStudentTypeField />

        {isDomesticOnly ? (
          <UndergraduateAdmissionRequirementsLocationDomesticField />
        ) : (
          <UndergraduateAdmissionRequirementsLocationField />
        )}

        <UndergraduateAdmissionRequirementsProgramField />

        <Button type="submit" disabled={!studentType || !location || !program || isPending} className="w-fit mt-8">
          View Requirements
        </Button>
      </form>
    </UndergraduateAdmissionRequirementsFormContext.Provider>
  );
}
