import { TextInput } from "@uoguelph/react-components/text-input";
import { Container } from "@uoguelph/react-components/container";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Select, SelectOptions, SelectOption, SelectButton } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";

export const PeopleSearchBar = ({ profiles, types,  units, onChange, className }) => {
  
  const [input, setInput] = useState("");
  const results = useSearch(profiles, input, nameAndTagSearch);
  const [selectedTypes, setSelectedTypes] = useState(types?.map(type => type.id) ?? []);
  const [selectedUnits, setSelectedUnits] = useState(units?.map(unit => unit.id) ?? []);

  const filtered = useMemo(() => {
    let filtered = results;

    if (Array.isArray(types) && types.length > 0) {
      filtered = filtered.filter((profile) =>
        profile.types?.some((type) => selectedTypes.includes(type.id))
      );
    }

    if (Array.isArray(units) && units.length > 0) {
      filtered = filtered.filter((profile) =>
        profile.units?.some((unit) => selectedUnits.includes(unit.id))
      );
    }

    return filtered;
  }, [results, selectedTypes, selectedUnits, types, units]);

  useEffect(() => {
    onChange?.(filtered);
  }, [filtered, onChange]);

  return (
    <div className="bg-grey-light-bg border-t-4 border-yellow w-full -m-1">
      <Container className={twMerge("flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>
        <div className="flex-1">
          <TextInput
            onInput={(e) => setInput(e.target.value)}
            placeholder="Enter Name"
          >
            <span className="text-l font-bold mb-1">Search by First or Last Name</span>
          </TextInput>
        </div>

        {types?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by role</Label>
              <Select
                multiple
                as="div"
                onChange={(options) => {
                  setSelectedTypes(options.length > 0 ? options.map(option => option.id) : types?.map(type => type.id) ?? []);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {types?.filter(type => selectedTypes.includes(type.id)).map(type => type.name).join(", ")}
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

        {units?.length > 0 && (
          <div className="sm:w-1/3 md:w-1/4">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by college, department, or unit</Label>
              <Select
                multiple
                as="div"
                onChange={(options) => {
                  setSelectedUnits(options.length > 0 ? options.map(option => option.id) : units?.map(unit => unit.id) ?? []);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {units?.filter(unit => selectedUnits.includes(unit.id)).map(unit => unit.name).join(", ")}
                  </span>
                </SelectButton>
                <SelectOptions>
                  {units.map((unit) => (
                    <SelectOption value={unit} key={unit.id}>
                      {unit.name}
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
