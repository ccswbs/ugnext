import getStudentTypesQuery from "./get-student-types.graphql";
import getLocationsQuery from "./get-locations.graphql";
import { graphql } from "@/lib/drupal";
import { partition } from "@/lib/array-utils";

export const STUDENT_TYPE_BASE_PATH = "/term/undergraduate/admission/student-types/";
export const LOCATION_BASE_PATH = "/term/undergraduate/admission/locations/";

export async function getStudentTypes() {
  const { data } = await graphql(getStudentTypesQuery);
  return data.termUndergraduateStudentTypes.nodes.map((node) => ({
    id: node.path.replace(STUDENT_TYPE_BASE_PATH, ""),
    name: node.name,
  }));
}

export async function getLocations() {
  let hasNextPage = true;
  let cursor = "";
  let locations = [];

  // We keep looping a while as long as there is an another page
  while (hasNextPage) {
    const { data } = await graphql(getLocationsQuery, {
      after: cursor,
    });

    const results = data.termAdmissionLocations.nodes.map((node) => ({
      id: node.path.replace(LOCATION_BASE_PATH, ""),
      name: node.name,
      type: node.type,
    }));

    locations = [...locations, ...results];
    hasNextPage = data.termAdmissionLocations.pageInfo.hasNextPage;
    cursor = data.termAdmissionLocations.pageInfo.endCursor;
  }

  const partitioned = partition(
    locations,
    (location) => location.type === "domestic",
    (location) => location.type === "international",
    (location) => location.type === "curriculum"
  );

  return {
    domestic: partitioned[0].map((location) => ({ id: location.id, name: location.name })),
    international: partitioned[1].map((location) => ({ id: location.id, name: location.name })),
    curriculum: partitioned[2].map((location) => ({ id: location.id, name: location.name })),
  };
}
