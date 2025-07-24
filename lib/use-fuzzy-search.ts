import {
  type AnySchema,
  create,
  insertMultiple,
  OramaPlugin,
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
  stemming?: boolean;
  plugins?: OramaPlugin[];
};

export function useFuzzySearch<TSchema extends AnySchema, TData extends PartialSchemaDeep<Schema<TSchema>>>({
  schema,
  data,
  stopwords = [],
  stemming = false,
  plugins,
}: Props<TSchema, TData>) {
  return useMemo(() => {
    const database = create({
      schema: schema,
      components: {
        tokenizer: {
          stopWords: [...englishStopwords, ...(stopwords ?? [])],
          stemming: stemming,
        },
      },
      plugins: plugins,
    });

    insertMultiple(database, data);

    return (params: SearchParams<typeof database>) =>
      search(database, params) as Results<TypedDocument<typeof database>>;
  }, [data, plugins, schema, stopwords]);
}
