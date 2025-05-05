import getStudentTypesQuery from "./get-student-types.graphql";
import getLocationsQuery from "./get-locations.graphql";
import getProgramIdsQuery from "./get-program-ids.graphql";
import getProgramDataQuery from "./get-program-data.graphql";
import { graphql } from "@/lib/drupal";
import { partition } from "@/lib/array-utils";

export const STUDENT_TYPE_BASE_PATH = "/term/undergraduate/admission/student-types/";
export const LOCATION_BASE_PATH = "/term/undergraduate/admission/locations/";
export const PROGRAM_BASE_PATH = "/node/undergraduate/";

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

export async function getPrograms(draft = false) {
  let page = 0;
  let total = 1;
  let ids = [];

  while (page < total) {
    const { data } = await graphql(getProgramIdsQuery, {
      page: page,
      status: draft ? undefined : true,
    });

    const results = data.undergraduateMajorsAndDegrees.results.map((node) => node.id);
    ids = [...ids, ...results];

    page++;
    total = data.undergraduateMajorsAndDegrees.pageInfo.total;
  }

  const programs = ids.map(async (id) => {
    const { data } = await graphql(getProgramDataQuery, {
      id: id,
      status: draft ? undefined : true,
    });

    const result = data.latestContentRevision.results[0];

    return {
      id: result.path.replace(PROGRAM_BASE_PATH, ""),
      name: result.name,
      tags: result.tags ?? [],
    };
  });

  return Promise.all(programs);
}
