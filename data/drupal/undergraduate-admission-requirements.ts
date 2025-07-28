import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type { AdmissionLocationFragment, UndergraduateAdmissionStudentTypeFragment } from "@/lib/graphql/types";

export type StudentType = UndergraduateAdmissionStudentTypeFragment;

export async function getStudentTypes() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionStudentTypes {
        termUndergraduateStudentTypes(first: 100) {
          nodes {
            __typename
            ...UndergraduateAdmissionStudentType
          }
        }
      }
    `),
  });

  return data.termUndergraduateStudentTypes.nodes as StudentType[];
}

export type AdmissionLocation = AdmissionLocationFragment;
export type AdmissionLocationType = "domestic" | "international" | "curriculum";

export async function getLocations() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionLocations {
        termAdmissionLocations(first: 100) {
          nodes {
            __typename
            ...AdmissionLocation
          }
        }
      }
    `),
  });

  return data.termAdmissionLocations.nodes as AdmissionLocation[];
}
