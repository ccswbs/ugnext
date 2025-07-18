import "dotenv/config";
import { CodegenConfig } from "@graphql-codegen/cli";

console.log("DRUPAL_BASE_URL:", process.env.NEXT_PUBLIC_DRUPAL_BASE_URL);
console.log("DRUPAL_API_KEY present:", !!process.env.DRUPAL_API_KEY);

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev";
const DRUPAL_API_KEY = process.env.DRUPAL_API_KEY;

if (!DRUPAL_API_KEY) {
  console.error("❌ DRUPAL_API_KEY environment variable is required for GraphQL schema introspection");
  console.error("Please ensure DRUPAL_API_KEY is set in your Netlify environment variables");
  process.exit(1);
}

// Test the GraphQL endpoint before running codegen
async function testGraphQLEndpoint() {
  const endpoint = `${DRUPAL_BASE_URL}/graphql`;
  console.log("🔍 Testing GraphQL endpoint:", endpoint);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': DRUPAL_API_KEY!,
      },
      body: JSON.stringify({
        query: `
          query IntrospectionQuery {
            __schema {
              queryType {
                name
              }
            }
          }
        `
      })
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ GraphQL endpoint error:", errorText);
      return false;
    }

    const result = await response.json();
    console.log("✅ GraphQL endpoint is accessible");
    console.log("📋 Schema query type:", result.data?.__schema?.queryType?.name);
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to GraphQL endpoint:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Run the test before exporting config
if (process.env.NODE_ENV !== 'test') {
  testGraphQLEndpoint().then(success => {
    if (!success) {
      console.error("❌ GraphQL endpoint test failed. Codegen may fail.");
    }
  }).catch(error => {
    console.error("❌ Endpoint test error:", error);
  });
}

const config: CodegenConfig = {
  schema: {
    [`${DRUPAL_BASE_URL}/graphql`]: {
      headers: {
        'api-key': DRUPAL_API_KEY,
        'User-Agent': 'GraphQL-Codegen/Netlify-Build',
      },
    },
  },
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
  silent: false,
  verbose: true,
  errorsOnly: false,
  config: {
    // Add timeout and retry configuration
    timeout: 30000, // 30 second timeout
  },
};

export default config;
