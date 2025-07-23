import {
  type AnySchema,
  create,
  insertMultiple,
  type PartialSchemaDeep,
  Results,
  type Schema,
  search,
  type SearchParams,
  TypedDocument,
} from "@orama/orama";
import { stopwords as englishStopwords } from "@orama/stopwords/english";
import { useMemo } from "react";

type Props<TSchema extends AnySchema, TData extends PartialSchemaDeep<Schema<TSchema>>> = {
  schema: TSchema;
  data: TData[];
  stopwords?: string[];
};

export function useFuzzySearch<TSchema extends AnySchema, TData extends PartialSchemaDeep<Schema<TSchema>>>({
  schema,
  data,
  stopwords = [],
}: Props<TSchema, TData>) {
  return useMemo(() => {
    const database = create({
      schema: schema,
      components: {
        tokenizer: {
          stopWords: [...englishStopwords, ...(stopwords ?? [])],
        },
      },
    });

    insertMultiple(database, data);

    return (params: SearchParams<typeof database>) =>
      search(database, params) as Results<TypedDocument<typeof database>>;
  }, [data, schema, stopwords]);
}
