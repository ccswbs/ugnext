import "dotenv/config";
import { CodegenConfig } from "@graphql-codegen/cli";

const DRUPAL_BASE_URL = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev").replace(
  /\/+(?=\?|#|$)/g,
  ""
);

console.log(`Fetching schema from ${DRUPAL_BASE_URL}/graphql`);

const schema: {
  [key: string]: {
    headers: {
      "api-key": string;
    };
  };
} = {};

schema[`${DRUPAL_BASE_URL}/graphql`] = {
  headers: {
    "api-key": process.env.DRUPAL_API_KEY ?? "",
  },
};

const config: CodegenConfig = {
  schema: schema,

  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "data/**/*.{ts,tsx}"],
  generates: {
    "./lib/graphql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
    "./lib/graphql/types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
