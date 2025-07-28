import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";

export async function getStudentTypes() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionStudentTypes {
        termUndergraduateStudentTypes(first: 100) {
          nodes {
            ...UndergraduateAdmissionStudentType
          }
        }
      }
    `),
  });

  return data.termUndergraduateStudentTypes.nodes;
}

export async function getLocations() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionLocations {
        termAdmissionLocations(first: 100) {
          nodes {
            ...AdmissionLocation
          }
        }
      }
    `),
  });

  return data.termAdmissionLocations.nodes;
}
