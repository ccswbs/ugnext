import getStudentTypesQuery from "./get-student-types.graphql";
import getLocationsQuery from "./get-locations.graphql";
import getProgramIdsQuery from "./get-program-ids.graphql";
import getProgramDataQuery from "./get-program-data.graphql";
import getStudentTypeFromPathQuery from "./get-student-type-from-path.graphql";
import getLocationFromPathQuery from "./get-location-from-path.graphql";
import getProgramFromPathQuery from "./get-program-from-path.graphql";
import getRequirementIds from "./get-requirement-ids.graphql";
import getRequirementContent from "./get-requirement-content.graphql";
import { graphql } from "@/lib/drupal";
import { partition } from "@/lib/array-utils";

const STUDENT_TYPE_BASE_PATH = "/term/undergraduate/admission/student-types/";
const LOCATION_BASE_PATH = "/term/undergraduate/admission/locations/";
const PROGRAM_BASE_PATH = "/node/undergraduate/";

export async function getStudentTypes() {
  const { data } = await graphql(getStudentTypesQuery);
  return data.termUndergraduateStudentTypes.nodes
    .sort((a, b) => a.weight - b.weight)
    .map((node) => ({
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
      tags: result.tags?.map((tag) => tag.name) ?? [],
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
  const { data } = await graphql(getRequirementIds, {
    studentType: studentType,
    location: location,
    program: Number.parseFloat(program.id),
  });

  const promises = data.undergraduateAdmissionRequirements.results.map(async ({ id }) => {
    const { data } = await graphql(getRequirementContent, {
      id: id,
      status: draft ? undefined : true,
    });

    const requirement = data.latestContentRevision.results[0];

    // Rank will determine how to order the requirement sections, a lower rank appears first.
    // Rank is determined by how many/how fields (e.g. type, location, program) are defined.
    // If a field is null, the rank increases by 2.
    // If a field has multiple values, it increases by 1.
    // If a field has a single value, it stays the same.
    let rank = 0;

    for (const field of ["type", "location", "program"]) {
      if (requirement[field] === null) {
        rank += 2;
      }

      if (Array.isArray(requirement[field]) && requirement[field].length > 1) {
        rank += 1;
      }
    }

    return {
      ...requirement,
      rank: rank,
    };
  });

  const requirements = (await Promise.all(promises))
    .sort((a, b) => a.rank - b.rank)
    .map((requirement) => ({
      title: requirement.title,
      path: requirement.path,
      sections: requirement.sections.map((section) => ({
        ...section,
        type: section.type.name,
        content: section?.content?.processed ?? "",
      })),
    }))
    .reduce(
      (acc, requirement) => {
        acc.paths.push({
          title: requirement.title,
          url: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${requirement.path}`,
        });

        for (let i = 0; i < requirement.sections.length; i++) {
          const section = requirement.sections[i];

          acc.sections[section.type] ??= [];
          acc.sections[section.type].push({
            overrides: section.overrides,
            content: section.content,
          });
        }

        return acc;
      },
      {
        sections: {},
        paths: [],
      }
    );

  const sections = [];

  for (const type in requirements.sections) {
    const firstOverridesIndex = requirements.sections[type].findIndex((section) => section.overrides);

    if (firstOverridesIndex >= 0) {
      requirements.sections[type] = requirements.sections[type].splice(0, firstOverridesIndex + 1);
    }

    const content = requirements.sections[type].map((section) => section.content).join(" ");

    if (content) {
      sections.push({
        title: type,
        content: requirements.sections[type].map((section) => section.content).join(" "),
      });
    }
  }

  return {
    sections: sections,
    paths: requirements.paths,
  };
}
