import { TextInput } from "@/components/text-input";
import { Select } from "@/components/select";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { useEffect, useState } from "react";

export const ProgramSearchBar = ({ programs, types, degreeTypes, onChange }) => {
  const [input, setInput] = useState("");
  const results = useSearch(programs, input, nameAndTagSearch);
  const [selectedTypes, setSelectedTypes] = useState(types?.map((type) => type.id) ?? []);
  const [selectedDegreeTypes, setSelectedDegreeTypes] = useState(degreeTypes?.map((degreeType) => degreeType.id) ?? []);

  useEffect(() => {
    let filtered = results;

    if (Array.isArray(types) && types.length > 0) {
      filtered = filtered.filter((program) => program.types.some((type) => selectedTypes.includes(type.id)));
    }

    if (Array.isArray(degreeTypes) && degreeTypes.length > 0) {
      filtered = filtered.filter((program) =>
        program.degrees.some((degree) => selectedDegreeTypes.includes(degree.type.id))
      );
    }

    onChange(filtered);
  }, [results, selectedTypes, selectedDegreeTypes, onChange, degreeTypes, types]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <TextInput
          onInput={(value) => setInput(value)}
          label={<span className="text-xl font-bold">What would you like to study?</span>}
          placeholder="ex. programming, engineering, psychology, etc."
        />
      </div>

      {types?.length > 0 && (
        <div className="sm:w-1/3 md:w-1/4">
          <Select
            multiple
            options={types.map((type) => ({ label: type.name, value: type.id, selected: true }))}
            onChange={(options) => {
              setSelectedTypes(options.map((option) => option.value));
            }}
            label={<span className="text-xl font-bold">Filter by type</span>}
          />
        </div>
      )}

      {degreeTypes?.length > 0 && (
        <div className="sm:w-1/3 md:w-1/4">
          <Select
            multiple
            options={degreeTypes.map((type) => ({ label: type.name, value: type.id, selected: true }))}
            onChange={(options) => {
              setSelectedDegreeTypes(options.map((option) => option.value));
            }}
            label={<span className="text-xl font-bold">Filter by degree type</span>}
          />
        </div>
      )}
    </div>
  );
};
