import { TextInput } from "@uoguelph/react-components/text-input";
import { Container } from "@uoguelph/react-components/container";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Select, SelectOptions, SelectOption, SelectButton } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";

export const ProgramSearchBar = ({ programs, types, degreeTypes, onChange, className }) => {
  const [input, setInput] = useState("");
  const results = useSearch(programs, input, nameAndTagSearch);
  const [selectedTypes, setSelectedTypes] = useState(types ?? []);
  const [selectedDegreeTypes, setSelectedDegreeTypes] = useState(degreeTypes ?? []);

  const filtered = useMemo(() => {
    let filtered = results;

    if (Array.isArray(types) && types.length > 0) {
      filtered = filtered.filter((program) =>
        program.types.some((type) => selectedTypes.some((t) => type.id === t.id))
      );
    }

    if (Array.isArray(degreeTypes) && degreeTypes.length > 0) {
      filtered = filtered.filter((program) =>
        program.degrees.some((degree) => selectedDegreeTypes.some((t) => degree.type.id === t.id))
      );
    }

    return filtered;
  }, [results, selectedTypes, selectedDegreeTypes, types, degreeTypes]);

  useEffect(() => {
    onChange?.(filtered);
  }, [filtered, onChange]);

  return (
    <div className="w-full bg-yellow -mt-1">
      <Container className={twMerge("bg-yellow flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>
        <div className="flex-1">
          <TextInput
            onInput={(e) => setInput(e.target.value)}
            placeholder="ex. programming, engineering, psychology, etc."
          >
            <span className="text-l font-bold mb-1">What would you like to study?</span>
          </TextInput>
        </div>

        {types?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by type</Label>
              <Select
                multiple
                onChange={(options) => {
                  setSelectedTypes(options.length > 0 ? options : types);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {selectedTypes.map((type) => type.name).join(", ")}
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
          </div>
        )}

        {degreeTypes?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by degree type</Label>
              <Select
                multiple
                onChange={(options) => {
                  setSelectedDegreeTypes(options.length > 0 ? options : degreeTypes);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {selectedDegreeTypes.map((type) => type.name).join(", ")}
                  </span>
                </SelectButton>
                <SelectOptions>
                  {degreeTypes.map((type) => (
                    <SelectOption value={type} key={type.id}>
                      {type.name}
                    </SelectOption>
                  ))}
                </SelectOptions>
              </Select>
            </Field>
          </div>
        )}
      </Container>
    </div>
  );
};
