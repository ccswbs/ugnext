import { graphql } from "@/lib/drupal";
import getDegreeTypesQuery from "./get-degree-types.graphql";
import getProgramTypesQuery from "./get-program-types.graphql";
import getDegreeIdsQuery from "./get-degree-ids.graphql";
import getDegreeLatestRevisionQuery from "./get-degree-latest-revision.graphql";
import getProgramIdsQuery from "./get-program-ids.graphql";
import getProgramLatestRevisionQuery from "./get-program-latest-revision.graphql";

export async function getDegreeTypes() {
  const { data } = await graphql(getDegreeTypesQuery);
  return data.termUndergraduateDegreeTypes.nodes.map((node) => node.name);
}

export async function getProgramTypes() {
  const { data } = await graphql(getProgramTypesQuery);
  return data.termUndergraduateProgramTypes.nodes.map((node) => node.name);
}

export async function getDegrees(draft = false) {
  // Get all the degree ids.
  // MOTE: we are making the assumption that they're no more than 100 degrees (a fair assumption since no university has 100 different degrees), otherwise this query will need to be refactored to use pagination/cursors.
  const { data } = await graphql(getDegreeIdsQuery);

  // Destructure the nodes to get the ids.
  const ids = data.nodeUndergraduateDegrees.nodes.map((node) => node.id);

  // Now that we have the ids, we can retrieve the content.
  const degrees = ids.map(async (id) => {
    const { data } = await graphql(getDegreeLatestRevisionQuery, {
      id: id,
      status: draft ? undefined : true,
    });

    const result = data.latestContentRevision.results[0];

    return {
      ...result,
      url: result.url?.url ?? "",
      type: result.type?.name ?? null,
      tags: result.tags ?? [],
    };
  });

  return Promise.all(degrees);
}

export async function getPrograms(draft = false) {
  // Similar idea to getDegrees but our assumption of less than 100 fails for programs, so we need to use pagination/cursors.

  let hasNextPage = true;
  let cursor = "";
  let ids = [];

  // We keep looping a while as long as there is an another page
  while (hasNextPage) {
    const { data } = await graphql(getProgramIdsQuery, {
      after: cursor,
    });

    const results = data.nodeUndergraduatePrograms.nodes.map((node) => node.id);

    ids = [...ids, ...results];
    hasNextPage = data.nodeUndergraduatePrograms.pageInfo.hasNextPage;
    cursor = data.nodeUndergraduatePrograms.pageInfo.endCursor;
  }

  const programs = ids.map(async (id) => {
    const { data } = await graphql(getProgramLatestRevisionQuery, {
      id: id,
      status: draft ? undefined : true,
    });

    const result = data.latestContentRevision.results[0];

    return {
      ...result,
      url: result.url?.url ?? "",
      type: result.type?.map((type) => type.name) ?? [],
      degree: result.degree?.name ?? null,
      tags: result.tags ?? [],
    };
  });

  return Promise.all(programs);
}
