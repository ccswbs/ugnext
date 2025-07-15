import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { UndergraduateDegreesQuery } from "@/lib/graphql/types";

export async function getUndergraduateDegreeTypes() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateDegreeTypes {
        termUndergraduateDegreeTypes(first: 100) {
          nodes {
            ...UndergraduateDegreeType
          }
        }
      }
    `),
  });

  return data.termUndergraduateDegreeTypes.nodes;
}

export const UNDERGRADUATE_DEGREE = gql(/* gql */ `
  fragment UndergraduateDegree on NodeUndergraduateDegree {
    id
    title
    status
    acronym
    url {
      url
      title
    }
    type {
      ...UndergraduateDegreeType
    }
    tags {
      ...UndergraduateProgramSearchTag
    }
  }
`);

export async function getUndergraduateDegrees() {
  const degreesQuery = gql(/* gql */ `
    query UndergraduateDegrees($after: Cursor = "") {
      nodeUndergraduateDegrees(after: $after, first: 100) {
        nodes {
          ...UndergraduateDegree
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
  const degrees: UndergraduateDegreesQuery['nodeUndergraduateDegrees']['nodes'] = [];

  while (hasNextPage) {
    const { data } = await query({
      query: degreesQuery,
      variables: {
        after: cursor,
      },
    });

    degrees.push(...data.nodeUndergraduateDegrees.nodes);
    cursor = data.nodeUndergraduateDegrees.pageInfo.endCursor;
    hasNextPage = data.nodeUndergraduateDegrees.pageInfo.hasNextPage;
  }

  return degrees;
}
