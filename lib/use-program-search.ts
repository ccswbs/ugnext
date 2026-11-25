import { create, insertMultiple, search as oramaSearch, type Results, type TypedDocument } from "@orama/orama";
import { pluginQPS } from "@orama/plugin-qps";
import { stopwords as englishStopwords } from "@orama/stopwords/english";
import { useMemo } from "react";

type ProgramDegree = { title?: string | null } | null | undefined;
type ProgramDegreeField = ProgramDegree | readonly ProgramDegree[];

export type ProgramSearchRecord = {
  id: string;
  title: string;
  tags?: string[] | null;
  degree?: ProgramDegreeField;
  degrees?: ProgramDegreeField;
};

const schema = { id: "string", title: "string", tags: "string[]", degreeTitles: "string[]" } as const;
const stopwords: string[] = [];

function getDegreeTitles(degreeField: ProgramDegreeField | undefined) {
  const degrees = Array.isArray(degreeField) ? degreeField : degreeField ? [degreeField] : [];
  return degrees.flatMap((degree) => (typeof degree?.title === "string" ? [degree.title] : []));
}

export function useProgramSearch<T extends ProgramSearchRecord>(
  programs: T[],
  query: string,
) {
  type ProgramWithSearchScore = T & { score?: number };

  const { database, programsById } = useMemo(() => {
    const database = create({
      schema,
      components: { tokenizer: { stopWords: [...englishStopwords, ...stopwords], stemming: true } },
      plugins: [pluginQPS()],
    });
    insertMultiple(
      database,
      programs.map((program) => ({
        id: program.id,
        title: program.title,
        tags: program.tags ?? [],
        degreeTitles: [...getDegreeTitles(program.degree), ...getDegreeTitles(program.degrees)],
      }))
    );

    return { database, programsById: new Map(programs.map((program) => [program.id, program])) };
  }, [programs]);

  return useMemo(() => {
    if (!query) return programs as ProgramWithSearchScore[];

    const results = oramaSearch(database, {
      term: query,
      properties: ["title", "tags", "degreeTitles"],
      tolerance: 0,
    }) as Results<TypedDocument<typeof database>>;

    return results.hits.flatMap((hit) => {
      const program = programsById.get(hit.document.id);
      return program ? [{ ...program, score: hit.score }] : [];
    });
  }, [database, programs, programsById, query]);
}
