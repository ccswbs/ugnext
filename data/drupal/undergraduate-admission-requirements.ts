import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type { AdmissionLocationFragment, UndergraduateAdmissionStudentTypeFragment } from "@/lib/graphql/types";
import { getRoute } from "@/data/drupal/route";

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

export async function getStudentTypeByPath(path: string) {
  const route = await getRoute(path);

  if (!route) {
    return null;
  }

  if (route.__typename !== "RouteInternal") {
    return null;
  }

  if (!route.entity) {
    return null;
  }

  if (route.entity.__typename !== "TermUndergraduateStudentType") {
    return null;
  }

  return route.entity as UndergraduateAdmissionStudentType;
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

export async function getLocationByPath(path: string) {
  const route = await getRoute(path);

  if (!route) {
    return null;
  }

  if (route.__typename !== "RouteInternal") {
    return null;
  }

  if (!route.entity) {
    return null;
  }

  if (route.entity.__typename !== "TermAdmissionLocation") {
    return null;
  }

  return route.entity as UndergraduateAdmissionLocation;
}
