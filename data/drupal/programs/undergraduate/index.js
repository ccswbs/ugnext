import { graphql } from "@/lib/drupal";
import getDegreeTypesQuery from "./get-degree-types.graphql";
import getProgramTypesQuery from "./get-program-types.graphql";
import getDegreesQuery from "./get-degrees.graphql";
import getDegreeLatestPublishedRevisionQuery from "./get-degree-latest-published-revision.graphql";
import getProgramsQuery from "./get-programs.graphql";
import getProgramLatestRevisionPublishedQuery from "./get-program-latest-published-revision.graphql";

export async function getDegreeTypes() {
  const { data } = await graphql(getDegreeTypesQuery);
  return data.termUndergraduateDegreeTypes.nodes.map((node) => node.name);
}

export async function getProgramTypes() {
  const { data } = await graphql(getProgramTypesQuery);
  return data.termUndergraduateProgramTypes.nodes.map((node) => node.name);
}

export async function getDegrees(draft = false) {
  // Get all the degrees.
  // MOTE: we are making the assumption that they're no more than 100 degrees (a fair assumption since no university has 100 different degrees), otherwise this query will need to be refactored to use pagination/cursors.
  const { data } = await graphql(getDegreesQuery);
  const degrees = [];
  const unpublished = [];

  // Partition the degrees into ones that are published vs unpublished, if we are in draft mode, then will just stick everything in the published array as we don't care about hiding unpublished content.
  for (const degree of data.nodeUndergraduateDegrees.nodes) {
    !draft || degree.status ? degrees.push(degree) : unpublished.push(degree);
  }

  // We are not in draft mode, so we want to update the content to the latest published revision
  for (const { id } of unpublished) {
    const { data } = await graphql(getDegreeLatestPublishedRevisionQuery, {
      id: id,
    });

    degrees.push(data.latestContentRevision.results[0]);
  }

  return degrees
    .map((degree) => ({
      ...degree,
      __typename: "undergraduate-degree",
      url: degree.url?.url
        ? degree.url.url?.startsWith("http")
          ? degree.url.url
          : `https://uoguelph.ca${degree.url.url}`
        : "",
      type: degree.type?.name ?? null,
      tags: degree.tags?.map((tag) => tag.name) ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPrograms(draft = false) {
  // Similar idea to getDegrees but our assumption of less than 100 fails for programs, so we need to use pagination/cursors.
  let hasNextPage = true;
  let cursor = "";
  const programs = [];
  const unpublished = [];

  // We keep looping a while as long as there is another page
  while (hasNextPage) {
    const { data } = await graphql(getProgramsQuery, {
      after: cursor,
    });

    for (const program of data.nodeUndergraduatePrograms.nodes) {
      !draft || program.status ? programs.push(program) : unpublished.push(program);
    }

    hasNextPage = data.nodeUndergraduatePrograms.pageInfo.hasNextPage;
    cursor = data.nodeUndergraduatePrograms.pageInfo.endCursor;
  }

  for (const { id } of unpublished) {
    const { data } = await graphql(getProgramLatestRevisionPublishedQuery, {
      id: id,
    });

    programs.push(data.latestContentRevision.results[0]);
  }

  return programs
    .map((program) => ({
      ...program,
      __typename: "undergraduate-program",
      url: program.url?.url
        ? program.url.url?.startsWith("http")
          ? program.url.url
          : `https://uoguelph.ca${program.url.url}`
        : "",
      type: program.type?.map((type) => type.name) ?? [],
      degree: program?.degree?.name ?? null,
      tags: program.tags?.map((tag) => tag.name) ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
