import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { UndergraduateProgramsQuery } from "@/lib/graphql/types";

export async function getUndergraduateProgramTypes() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateProgramTypes {
        termUndergraduateProgramTypes(first: 100) {
          nodes {
            ...UndergraduateProgramType
          }
        }
      }
    `),
  });

  return data.termUndergraduateProgramTypes.nodes;
}

export const UNDERGRADUATE_PROGRAM = gql(/* gql */ `
  fragment UndergraduateProgram on NodeUndergraduateProgram {
    id
    title
    status
    acronym
    url {
      url
      title
    }
    degree {
      id
      title
    }
    type {
      ...UndergraduateProgramType
    }
    tags {
      ...UndergraduateProgramSearchTag
    }
  }
`);

export async function getUndergraduateProgram() {
  const programsQuery = gql(/* gql */ `
    query UndergraduatePrograms($after: Cursor = "") {
      nodeUndergraduatePrograms(after: $after, first: 100) {
        nodes {
          ...UndergraduateProgram
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const programs: UndergraduateProgramsQuery['nodeUndergraduatePrograms']['nodes'] = [];

  while (hasNextPage) {
    const { data } = await query({
      query: programsQuery,
      variables: {
        after: cursor,
      },
    });

    programs.push(...data.nodeUndergraduatePrograms.nodes);
    cursor = data.nodeUndergraduatePrograms.pageInfo.endCursor;
    hasNextPage = data.nodeUndergraduatePrograms.pageInfo.hasNextPage;
  }

  return programs;
}
