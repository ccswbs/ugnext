import { handleGraphQLError, query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type {
  UndergraduateDegreeFragment,
  UndergraduateDegreesQuery,
  UndergraduateDegreeTypeFragment,
} from "@/lib/graphql/types";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";

export type UndergraduateDegreeType = UndergraduateDegreeTypeFragment;
export type UndergraduateDegree = Omit<UndergraduateDegreeFragment, "tags"> & {
  tags: string[];
};

function parse(degree: UndergraduateDegreeFragment) {
  return {
    ...degree,
    tags: degree?.tags?.map((tag) => tag.name) ?? [],
  } as UndergraduateDegree;
}

export async function getUndergraduateDegreeTypes() {
  const { data, error } = await query({
    query: gql(/* gql */ `
      query UndergraduateDegreeTypes {
        termUndergraduateDegreeTypes(first: 100) {
          nodes {
            ...UndergraduateDegreeType
          }
        }
      }
    `),
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  return data.termUndergraduateDegreeTypes.nodes;
}

export const UNDERGRADUATE_DEGREE = gql(/* gql */ `
  fragment UndergraduateDegree on NodeUndergraduateDegree {
    __typename
    id
    title
    status
    acronym
    url {
      url
      title
    }
    type {
      ...UndergraduateDegreeType
    }
    tags {
      ...UndergraduateProgramSearchTag
    }
  }
`);

async function getDraftUndergraduateDegrees() {
  const degreeQuery = gql(/* gql */ `
    query DraftUndergraduateDegrees($pageSize: Int = 100, $page: Int = 0) {
      latestContentRevisions(filter: { type: "undergraduate_degree" }, pageSize: $pageSize, page: $page) {
        pageInfo {
          total
        }
        results {
          __typename
          ...UndergraduateDegree
        }
      }
    }
  `);

  const degrees: UndergraduateDegreesQuery["nodeUndergraduateDegrees"]["nodes"] = [];
  const pageSize = 100;
  let page = 0;
  let total = 1;

  while (page < total) {
    const { data, error } = await query({
      query: degreeQuery,
      variables: {
        pageSize,
        page,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    for (const degree of data?.latestContentRevisions?.results ?? []) {
      if (degree.__typename === "NodeUndergraduateDegree") {
        degrees.push(degree);
      }
    }

    total = Math.ceil((data?.latestContentRevisions?.pageInfo?.total ?? 0) / pageSize);
    page++;
  }

  return degrees.map(parse);
}

async function getPublishedUndergraduateDegrees() {
  const degreesQuery = gql(/* gql */ `
    query UndergraduateDegrees($after: Cursor = "") {
      nodeUndergraduateDegrees(after: $after, first: 100) {
        nodes {
          ...UndergraduateDegree
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
  const degrees: UndergraduateDegreesQuery["nodeUndergraduateDegrees"]["nodes"] = [];

  while (hasNextPage) {
    const { data, error } = await query({
      query: degreesQuery,
      variables: {
        after: cursor,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    if (data) {
      degrees.push(...data.nodeUndergraduateDegrees.nodes);
      cursor = data.nodeUndergraduateDegrees.pageInfo.endCursor;
      hasNextPage = data.nodeUndergraduateDegrees.pageInfo.hasNextPage;
    } else {
      hasNextPage = false;
      console.warn("Undergraduate Degrees: failed to retrieve all degrees, showing partial results");
    }
  }

  return degrees.filter((degree) => degree.status).map(parse);
}

export async function getUndergraduateDegrees() {
  if (await showUnpublishedContent()) {
    return await getDraftUndergraduateDegrees();
  }

  return await getPublishedUndergraduateDegrees();
}
