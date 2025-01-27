import { TextInput } from "@/components/text-input";
import { Select } from "@/components/select";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getWords, StringSimilarity } from "@/lib/string-utils";
import { FuzzySearch, Term } from "@/lib/fuzzy-search";

const programFuzzySearch = (programs) => {
  const fuzzySearch = new FuzzySearch(
    programs,
    (program) => {
      const nameTerms = [new Term(program.name, 100)];
      const tagTerms = program.tags
        .map((tag) => getWords(tag).map((word, index) => new Term(word, 30 / (index + 1))))
        .flat();

      return [...nameTerms, ...tagTerms];
    },
    [StringSimilarity.levenshtein, StringSimilarity.stemmer, StringSimilarity.bidirectionalSubstring]
  );

  return (input) => {
    return fuzzySearch.search(input);
  };
};

export const ProgramSearchBar = ({ programs, types, degreeTypes, onChange, className }) => {
  const [input, setInput] = useState("");
  const results = useSearch(programs, input, nameAndTagSearch);
  const [selectedTypes, setSelectedTypes] = useState(types?.map((type) => type.id) ?? []);
  const [selectedDegreeTypes, setSelectedDegreeTypes] = useState(degreeTypes?.map((degreeType) => degreeType.id) ?? []);
  const testResults = useSearch(programs, input, programFuzzySearch);

  const filtered = useMemo(() => {
    let filtered = results;

    if (Array.isArray(types) && types.length > 0) {
      filtered = filtered.filter((program) => program.types.some((type) => selectedTypes.includes(type.id)));
    }

    if (Array.isArray(degreeTypes) && degreeTypes.length > 0) {
      filtered = filtered.filter((program) =>
        program.degrees.some((degree) => selectedDegreeTypes.includes(degree.type.id))
      );
    }

    return filtered;
  }, [results, selectedTypes, selectedDegreeTypes, types, degreeTypes]);

  useEffect(() => {
    onChange?.(filtered);
  }, [filtered, onChange]);

  return (
    <div className={twMerge("flex flex-col gap-4 sm:flex-row sm:items-end", className)}>
      <div className="flex-1">
        <TextInput
          onInput={(value) => setInput(value)}
          label={<span className="text-xl font-bold mb-1">What would you like to study?</span>}
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
