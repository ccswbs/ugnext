import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type { AdmissionLocationFragment, UndergraduateAdmissionStudentTypeFragment } from "@/lib/graphql/types";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";

export type UndergraduateAdmissionStudentType = UndergraduateAdmissionStudentTypeFragment;

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

  return data.termUndergraduateStudentTypes.nodes as UndergraduateAdmissionStudentType[];
}

export type UndergraduateAdmissionLocation = AdmissionLocationFragment;
export type UndergraduateAdmissionLocationType = "domestic" | "international" | "curriculum";

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

  return data.termAdmissionLocations.nodes.toSorted((a, b) => {
    const typeOrder = {
      domestic: 0,
      international: 1,
      curriculum: 2,
    };

    const aOrder = a.type in typeOrder ? typeOrder[a.type as UndergraduateAdmissionLocationType] : 3;
    const bOrder = b.type in typeOrder ? typeOrder[b.type as UndergraduateAdmissionLocationType] : 3;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.name.localeCompare(b.name);
  }) as UndergraduateAdmissionLocation[];
}

export async function getPageTitle(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {}
