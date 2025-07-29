import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import type {
  UndergraduateProgramsQuery,
  UndergraduateProgramFragment,
  UndergraduateProgramTypeFragment,
} from "@/lib/graphql/types";
import { getRoute } from "@/data/drupal/route";

export type UndergraduateProgramType = UndergraduateProgramTypeFragment;
export type UndergraduateProgram = Omit<UndergraduateProgramFragment, "tags"> & {
  tags: string[];
};

function parse(degree: UndergraduateProgramFragment) {
  return {
    ...degree,
    tags: degree?.tags?.map((tag) => tag.name) ?? [],
  } as UndergraduateProgram;
}

export async function getUndergraduateProgramTypes() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateProgramTypes {
        termUndergraduateProgramTypes(first: 100) {
          nodes {
            ...UndergraduateProgramType
          }
        }
      }
    `),
  });

  return data.termUndergraduateProgramTypes.nodes;
}

export const UNDERGRADUATE_PROGRAM = gql(/* gql */ `
  fragment UndergraduateProgram on NodeUndergraduateProgram {
    __typename
    id
    title
    status
    acronym
    url {
      url
    }
    degree {
      id
      title
    }
    path
    type {
      ...UndergraduateProgramType
    }
    tags {
      ...UndergraduateProgramSearchTag
    }
  }
`);

async function getDraftUndergraduatePrograms() {
  const programsQuery = gql(/* gql */ `
    query DraftUndergraduatePrograms($pageSize: Int = 100, $page: Int = 0) {
      latestContentRevisions(filter: { type: "undergraduate_program" }, pageSize: $pageSize, page: $page) {
        pageInfo {
          total
        }
        results {
          __typename
          ...UndergraduateProgram
        }
      }
    }
  `);

  const programs: UndergraduateProgramsQuery["nodeUndergraduatePrograms"]["nodes"] = [];
  const pageSize = 100;
  let page = 0;
  let total = 1;

  while (page < total) {
    const { data } = await query({
      query: programsQuery,
      variables: {
        pageSize,
        page,
      },
    });

    for (const program of data?.latestContentRevisions?.results ?? []) {
      if (program.__typename === "NodeUndergraduateProgram") {
        programs.push(program);
      }
    }

    total = Math.ceil((data?.latestContentRevisions?.pageInfo?.total ?? 0) / pageSize);
    page++;
  }

  return programs.map(parse);
}

async function getPublishedUndergraduatePrograms() {
  const programsQuery = gql(/* gql */ `
    query UndergraduatePrograms($after: Cursor = "") {
      nodeUndergraduatePrograms(after: $after, first: 100) {
        nodes {
          ...UndergraduateProgram
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const programs: UndergraduateProgramsQuery["nodeUndergraduatePrograms"]["nodes"] = [];

  while (hasNextPage) {
    const { data } = await query({
      query: programsQuery,
      variables: {
        after: cursor,
      },
    });

    programs.push(...data.nodeUndergraduatePrograms.nodes);
    cursor = data.nodeUndergraduatePrograms.pageInfo.endCursor;
    hasNextPage = data.nodeUndergraduatePrograms.pageInfo.hasNextPage;
  }

  return programs.filter((program) => program.status).map(parse);
}

export async function getUndergraduatePrograms() {
  if (await showUnpublishedContent()) {
    return await getDraftUndergraduatePrograms();
  }

  return await getPublishedUndergraduatePrograms();
}

export async function getUndergraduateMajors() {
  const programs = await getUndergraduatePrograms();
  return programs
    .filter((program) => program.type.some((type) => type.name.toLowerCase() === "major"))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getUndergraduateProgramByPath(path: string) {
  const showUnpublished = await showUnpublishedContent();
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

  if (route.entity.__typename !== "NodeUndergraduateProgram") {
    return null;
  }

  const programQuery = gql(/* gql */ `
    query UndergraduateProgramByID($id: ID!, $revision: ID = "latest") {
      nodeUndergraduateProgram(id: $id, revision: $revision) {
        ...UndergraduateProgram
      }
    }
  `);

  const { data } = await query({
    query: programQuery,
    variables: {
      id: route.entity.id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  return data.nodeUndergraduateProgram as UndergraduateProgram | null;
}
