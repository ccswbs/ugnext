import getStudentTypesQuery from "./get-student-types.graphql";
import getLocationsQuery from "./get-locations.graphql";
import getProgramIdsQuery from "./get-program-ids.graphql";
import getProgramDataQuery from "./get-program-data.graphql";
import getStudentTypeFromPathQuery from "./get-student-type-from-path.graphql";
import getLocationFromPathQuery from "./get-location-from-path.graphql";
import getProgramFromPathQuery from "./get-program-from-path.graphql";
import { graphql } from "@/lib/drupal";
import { partition } from "@/lib/array-utils";

const STUDENT_TYPE_BASE_PATH = "/term/undergraduate/admission/student-types/";
const LOCATION_BASE_PATH = "/term/undergraduate/admission/locations/";
const PROGRAM_BASE_PATH = "/node/undergraduate/";

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

export async function parseRequirementPageSlug(slug) {
  const studentTypePath = `${STUDENT_TYPE_BASE_PATH}${slug[0]}`;
  const locationPath = `${LOCATION_BASE_PATH}${slug[1]}`;
  const programPath = `${PROGRAM_BASE_PATH}${slug[2]}/${slug[3]}`;

  const studentType = await graphql(getStudentTypeFromPathQuery, {
    path: studentTypePath,
  });

  const location = await graphql(getLocationFromPathQuery, {
    path: locationPath,
  });

  const program = await graphql(getProgramFromPathQuery, {
    path: programPath,
  });

  return {
    studentType: studentType?.data?.route?.entity?.name ?? null,
    location: location?.data?.route?.entity?.name ?? null,
    program: program?.data?.route?.entity
      ? {
          id: program?.data?.route?.entity?.id,
          name: program?.data?.route?.entity?.name,
          url: program?.data?.route?.entity?.url?.url ?? "",
        }
      : null,
  };
}

export async function getRequirements(studentType, location, program, draft = false) {
  return null;
}
