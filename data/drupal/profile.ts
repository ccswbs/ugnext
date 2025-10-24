import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { getClient, handleGraphQLError } from "@/lib/apollo";
import type { FullProfile } from "@/lib/types";
import type { PartialProfileFragment, ProfileTypeFragment } from "@/lib/graphql/types";

// GraphQL Response Types
interface PageInfo {
  total: number;
  pageSize: number;
}

interface ProfilesResponse {
  profiles: {
    results: FullProfile[];
    pageInfo: PageInfo;
  };
}

// Configuration constants
const DEFAULT_PAGE_SIZE = 20; // Match your Drupal backend configuration
const MAX_PAGE_SIZE = 100; // Reasonable maximum to prevent overwhelming requests

export const PROFILE_FRAGMENT = gql(/* gql */ `
  fragment Profile on NodeProfile {
    status
    id
    title
    path
    primaryNavigation {
      ...Navigation
    }
    centralLoginId
    directoryEmail
    directoryOffice
    directoryPhone
    uniwebId
    body {
      processed
      summary
    }
    customLink {
      title
      url
    }
    profileJobTitle
    profileType {
      ...ProfileType
    }
    profileUnit {
      ...Unit
    }
    profileFields {
      label {
        processed
      }
      value {
        processed
      }
    }
    profileResearchAreas {
      ...Research
    }
    profileSections {
      ... on ParagraphProfilePart {
        id
        profilePartText {
          processed
        }
        profilePartLabel
      }
      ... on ParagraphUniwebPart {
        uniwebSelect {
          name
        }
      }
    }
    profilePicture {
      ...Image
    }
    tags {
      ...Tag
    }
  }
`);

export async function getProfileContent(id: string) {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query ProfileContent($id: ID!, $revision: ID = "current") {
        nodeProfile(id: $id, revision: $revision) {
          ...Profile
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!(data as any)?.nodeProfile) {
    return null;
  }

  if ((data as any).nodeProfile.status === false && !showUnpublished) {
    return null;
  }

  return {
    ...(data as any).nodeProfile,
  };
}

export async function getProfileTypes() {
  const client = getClient();
  const { data } = await client.query({
    query: gql(/* GraphQL */ `
      query GetProfileTypes {
        taxonomyTerms(filter: { vid: "profile_type" }) {
          results {
            ... on TermProfileType {
              id
              name
            }
          }
        }
      }
    `),
  });

  if (!(data as any)?.taxonomyTerms?.results) {
    return [];
  }

  return (data as any).taxonomyTerms.results;
}

/**
 * Get profile type ID by name
 */
export async function getProfileTypeIdByName(profileTypeName: string): Promise<string | null> {
  try {
    const profileTypes = await getProfileTypes();
    const profileType = profileTypes.find((type: any) => type.name === profileTypeName);
    return profileType?.id || null;
  } catch (error) {
    console.error(`Error finding profile type ID for "${profileTypeName}":`, error);
    return null;
  }
}

// NEW STUFF
export const VALID_PAGE_SIZES = [5, 10, 20, 25, 50];

export type ProfileSearchOptions = {
  /* The results of the search are paginated, so we specify which page to fetch. */
  page: number;
  /* The number of results to fetch per page. */
  pageSize: number;
  /* This string will be used in a full-text search on the first name and last name of the profile. */
  queryByName: string;
  /* This string will be used in a full-text search on the research areas of the profile. */
  queryByResearchArea: string;
  /* The IDs of each unit to filter by. If not provided, all units will be included. */
  units: string[];
  /* The IDs of each profile type to filter by. If not provided, all types will be included. */
  types: string[];
  /* Filter by whether the profile is accepting graduate students. Leave as null to include both */
  isAcceptingGraduateStudents: boolean | null;
};

export const PARTIAL_PROFILE_FRAGMENT = gql(/* gql */ `
  fragment PartialProfile on NodeProfile {
    id
    title
    profileJobTitle
    path
    profilePicture {
      ... on MediaImage {
        image {
          alt
          variations(styles: PROFILES) {
            width
            url
            height
          }
        }
      }
    }
  }
`);

export type PartialProfileData = NonNullable<PartialProfileFragment>;

export async function getFilteredProfiles(options: ProfileSearchOptions) {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();
  const { page, pageSize, queryByName, queryByResearchArea, units, types, isAcceptingGraduateStudents } = options;

  // Validate filter options
  if (isNaN(page) || page < 0) {
    throw new Error("Page must be a positive integer.");
  }

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    throw new Error(`Invalid page size: ${pageSize}. Valid page sizes are: ${VALID_PAGE_SIZES.join(", ")}`);
  }

  if (queryByName.length > 128) {
    throw new Error("queryByName must not be longer than 128 characters.");
  }

  if (queryByResearchArea.length > 128) {
    throw new Error("queryByResearchArea must not be longer than 128 characters.");
  }

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query ProfileSearch(
        $queryByName: String = ""
        $queryByResearchArea: String = ""
        $page: Int = 0
        $size: Int = 20
        $units: [String] = []
        $types: [String] = ""
        $status: Boolean = null
        $acceptingNewGrads: Boolean = null
      ) {
        profileSearch(
          filter: {
            queryByName: $queryByName
            queryByResearchArea: $queryByResearchArea
            units: $units
            types: $types
            status: $status
            accepting_new_grads: $acceptingNewGrads
          }
          page: $page
          pageSize: $size
        ) {
          results {
            ...PartialProfile
          }
          pageInfo {
            total
          }
        }
      }
    `),
    variables: {
      page: page,
      size: pageSize,
      units: units,
      types: types,
      queryByName: queryByName,
      queryByResearchArea: queryByResearchArea,
      status: showUnpublished ? null : true,
      acceptingNewGrads: isAcceptingGraduateStudents,
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return { results: [], totalPages: 0 };
  }

  if (!data.profileSearch) {
    return { results: [], totalPages: 0 };
  }

  let results: PartialProfileData[] = data.profileSearch.results;

  if (showUnpublished) {
    // The search database only indexes the current revision of a node, so we need to fetch the latest revision.
    // Map each result to its latest revision.
    // Unfortunately, this means making a request for each result individually.
    // This is not ideal as it is bad for performance,
    // but it is the best we can do for now,
    // and since this will only be used in draft mode or the dev server, it should be fine.

    const latestRevisionQuery = gql(/* gql */ `
      query LatestRevisionProfile($id: ID!) {
        nodeProfile(id: $id, revision: "latest") {
          ...PartialProfile
        }
      }
    `);

    results = await Promise.all(
      results.map(async (result) => {
        const { data } = await client.query({
          query: latestRevisionQuery,
          variables: { id: result.id },
        });

        if (!data || !data.nodeProfile) {
          console.warn(`Failed to fetch latest revision for profile ${result.id}, falling back to original result`);
          return result;
        }

        return data.nodeProfile;
      })
    );
  }

  return {
    results: results,
    totalPages: Math.ceil(data.profileSearch.pageInfo.total / options.pageSize),
    total: data.profileSearch.pageInfo.total,
  };
}

export type ProfileType = NonNullable<ProfileTypeFragment>;

export async function getAllTypes() {
  const client = getClient();
  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query AllProfileTypes {
        termProfileTypes(first: 4) {
          nodes {
            ...ProfileType
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

  if (!data.termProfileTypes) {
    return [];
  }

  return data.termProfileTypes.nodes as ProfileType[];
}

export type Unit = {
  __typename: "TermUnit";
  id: string;
  acronym: string;
  name: string;
  parent?: { name: string; acronym?: string } | null;
};

export async function getAllUnits(): Promise<Unit[]> {
  try {
    const client = getClient();
    
    const { data } = await client.query({
      query: gql(/* GraphQL */ `
        query GetAllUnits {
          termUnits(first: 100) {
            edges {
              node {
                ...Unit
              }
            }
          }
        }
      `) as any,
    });

    if ((data as any)?.termUnits?.edges) {
      const units = (data as any).termUnits.edges.map((edge: any) => edge.node) as Unit[];
      
      // Sort units alphabetically by name
      return units.sort((a, b) => a.name.localeCompare(b.name));
    }

    console.warn("No units found in termUnits query");
    return [];
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
}
