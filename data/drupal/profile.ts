import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
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

  const { data, error } = await query({
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

export async function getProfiles(page: number = 0, pageSize: number = DEFAULT_PAGE_SIZE) {
  /*try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL / `
      query GetProfiles($page: Int = 0, $pageSize: Int = 20) {
        profiles(page: $page, pageSize: $pageSize) {
          results {
            ... on NodeProfile {
              id
              title
              path
              profileJobTitle
              profileFirstName
              profileLastName
              profileResearchAreas {
                ...Research
              }
              profileType {
                ...ProfileType
              }
              profileUnit {
                id
                name
              }
              profilePicture {
                ...Image
              }
              tags {
                ...Tag
                ...Unit
              }
            }
          }
          pageInfo {
            total
            pageSize
          }
        }
      }
    `) as any;

    const { data } = await client.query({
      query: profilesQuery,
      variables: {
        page,
        pageSize,
      },
    }) as { data: ProfilesResponse };

    if (!data?.profiles?.results) {
      return [];
    }

    return data.profiles.results;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }*/

  return [];
}

export async function getProfilesByType(profileType: string, page: number = 0, pageSize: number = 100) {
  /*try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL  `
      query GetProfilesByType($type: String!, $page: Int = 0, $pageSize: Int = 100) {
        profiles(contextualFilter: { field_profile_type_target_id: $type }, page: $page, pageSize: $pageSize) {
          results {
            ... on NodeProfile {
              id
              title
              path
              profileJobTitle
              profileFirstName
              profileLastName
              profileResearchAreas {
                ...Research
              }
              profileType {
                ...ProfileType
              }
              profileUnit {
                id
                name
              }
              profilePicture {
                ...Image
              }
              tags {
                ...Tag
                ...Unit
              }
            }
          }
          pageInfo {
            total
            pageSize
          }
        }
      }
    `) as any;

    const { data } = await client.query({
      query: profilesQuery,
      variables: {
        type: profileType,
        page,
        pageSize,
      },
    }) as { data: ProfilesResponse };

    if (!data?.profiles?.results) {
      return [];
    }

    return data.profiles.results;
  } catch (error) {
    console.error(`Error fetching profiles by type "${profileType}":`, error);
    return [];
  }*/

  return [];
}

export async function getProfilesByUnit(unitId: string, page: number = 0, pageSize: number = 100) {
  /*try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL * `
      query GetProfilesByUnit($unit: String!, $page: Int = 0, $pageSize: Int = 100) {
        profiles(contextualFilter: { field_profile_unit_target_id: $unit }, page: $page, pageSize: $pageSize) {
          results {
            ... on NodeProfile {
              id
              title
              path
              profileJobTitle
              profileFirstName
              profileLastName
              profileResearchAreas {
                ...Research
              }
              profileType {
                ...ProfileType
              }
              profileUnit {
                id
                name
              }
              profilePicture {
                ...Image
              }
              tags {
                ...Tag
                ...Unit
              }
            }
          }
          pageInfo {
            total
            pageSize
          }
        }
      }
    `) as any;

    const { data } = await client.query({
      query: profilesQuery,
      variables: {
        unit: unitId,
        page,
        pageSize,
      },
    }) as { data: ProfilesResponse };

    if (!data?.profiles?.results) {
      return [];
    }

    return data.profiles.results;
  } catch (error) {
    console.error(`Error fetching profiles by unit "${unitId}":`, error);
    return [];
  }
  */
  return [];
}

export async function getProfilesByUnitPaginated(
  unitId: string,
  page: number = 0,
  pageSize: number = 20,
  searchTerm?: string
) {
  /*try {
    const client = getClient();

    // If we have a search term, fetch ALL profiles from this unit to search through
    const actualPageSize = searchTerm ? 1000 : pageSize; // Fetch many more profiles when searching
    const actualPage = searchTerm ? 0 : page; // Always start from page 0 when searching

    const { data } = (await client.query({
      query: gql(/* GraphQL / `
        query GetProfilesByUnitPaginated($unit: String!, $page: Int = 0, $pageSize: Int = 20) {
          profiles(contextualFilter: { field_profile_unit_target_id: $unit }, page: $page, pageSize: $pageSize) {
            results {
              ... on NodeProfile {
                id
                title
                path
                profileJobTitle
                profileFirstName
                profileLastName
                profileResearchAreas {
                  ...Research
                }
                profileType {
                  ...ProfileType
                }
                profileUnit {
                  id
                  name
                }
                profilePicture {
                  ...Image
                }
                tags {
                  ...Tag
                  ...Unit
                }
              }
            }
            pageInfo {
              total
              pageSize
            }
          }
        }
      `) as any,
      variables: {
        unit: unitId,
        page: actualPage,
        pageSize: actualPageSize,
      },
    })) as { data: ProfilesResponse };

    if (!data?.profiles) {
      return {
        results: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    let results = data.profiles.results;
    let total = data.profiles.pageInfo?.total || 0;

    // If we have a search term, filter the results client-side
    if (searchTerm && searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();

      results = results.filter((profile) => {
        const firstName = (profile.profileFirstName || "").toLowerCase();
        const lastName = (profile.profileLastName || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const title = (profile.title || "").toLowerCase();
        const jobTitle = (profile.profileJobTitle || "").toLowerCase();

        return (
          fullName.includes(searchTermLower) ||
          firstName.includes(searchTermLower) ||
          lastName.includes(searchTermLower) ||
          title.includes(searchTermLower) ||
          jobTitle.includes(searchTermLower)
        );
      });

      // Update total to reflect filtered results
      total = results.length;
    }

    const totalPages = Math.ceil(total / pageSize);

    return {
      results,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error(`Error fetching paginated profiles by unit "${unitId}":`, error);
    return {
      results: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }*/

  return [];
}

export async function getProfilesByTag(tagName: string) {
  /*try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL * `
      query GetProfilesByTag($tag: String!, $page: Int = 0, $pageSize: Int = 20) {
        profiles(contextualFilter: { field_tags_target_id: $tag }, page: $page, pageSize: $pageSize) {
          results {
            ... on NodeProfile {
              id
              title
              path
              profileFirstName
              profileLastName        
              profileType {
                ...ProfileType
              }
              profilePicture {
                ...Image
              }
            }
          }
          pageInfo {
            total
            pageSize
          }
        }
      }
    `) as any;

    let page = 0;
    const pageSize = 20;
    const profiles: any[] = [];
    let total = 0;
    let totalPages = 1;

    do {
      const { data } = await client.query({
        query: profilesQuery,
        variables: {
          tag: tagName,
          page,
          pageSize,
        },
      }) as { data: ProfilesResponse };

      if (!data?.profiles?.results) {
        break;
      }

      profiles.push(...data.profiles.results);
      total = data.profiles.pageInfo?.total || 0;
      totalPages = Math.ceil(total / pageSize);
      page++;
    } while (page < totalPages);

    return { results: profiles };
  } catch (error) {
    console.error(`Error fetching profiles by tag "${tagName}":`, error);
    return { results: [] };
  }*/

  return [];
}

export async function getProfileCount() {
  /*try {
    const client = getClient();
    const { data } = await client.query({
      query: gql(/* GraphQL * `
        query GetProfileCount {
          profiles(page: 0, pageSize: 1) {
            pageInfo {
              total
              pageSize
            }
          }
        }
      `) as any,
    }) as { data: ProfilesResponse };

    return data?.profiles?.pageInfo?.total || 0;
  } catch (error) {
    console.error("Error fetching profile count:", error);
    return 0;
  }*/
  return 0;
}

export async function getProfilesPaginated(page: number = 0, pageSize: number = 20, searchTerm?: string) {
  /*try {
    const client = getClient();
    
    // If we have a search term, fetch ALL profiles to search through
    const actualPageSize = searchTerm ? 1000 : pageSize; // Fetch many more profiles when searching
    const actualPage = searchTerm ? 0 : page; // Always start from page 0 when searching
    
    const { data } = await client.query({
      query: gql(/* GraphQL / `
        query GetProfilesPaginated($page: Int = 0, $pageSize: Int = 20, $filter: ProfilesFilterInput) {
          profiles(page: $page, pageSize: $pageSize, filter: $filter) {
            results {
              ... on NodeProfile {
                id
                title
                path
                profileJobTitle
                profileFirstName
                profileLastName
                profileResearchAreas {
                  ...Research
                }
                profileType {
                  ...ProfileType
                }
                profileUnit {
                  id
                  name
                }
                profilePicture {
                  ...Image
                }
                tags {
                  ...Tag
                  ...Unit
                }
              }
            }
            pageInfo {
              total
              pageSize
            }
          }
        }
      `) as any,
      variables: {
        page: actualPage,
        pageSize: actualPageSize,
        filter: searchTerm ? { title: searchTerm } : null,
      },
    }) as { data: ProfilesResponse };

    if (!data?.profiles) {
      return {
        results: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    let results = data.profiles.results;
    let total = data.profiles.pageInfo?.total || 0;

    // If we have a search term, filter the results client-side
    if (searchTerm && searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      
      results = results.filter(profile => {
        const firstName = (profile.profileFirstName || '').toLowerCase();
        const lastName = (profile.profileLastName || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const title = (profile.title || '').toLowerCase();
        const jobTitle = (profile.profileJobTitle || '').toLowerCase();
        
        return fullName.includes(searchTermLower) || 
               firstName.includes(searchTermLower) ||
               lastName.includes(searchTermLower) ||
               title.includes(searchTermLower) || 
               jobTitle.includes(searchTermLower);
      });
      
      // Update total to reflect filtered results
      total = results.length;
    }

    const totalPages = Math.ceil(total / pageSize);

    return {
      results,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching paginated profiles:", error);
    return {
      results: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }*/
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
 * This is needed because getProfilesByType expects an ID, not a name
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

/**
 * Get profiles by type name (converts name to ID internally)
 */
export async function getProfilesByTypeName(profileTypeName: string, page: number = 0, pageSize: number = 100) {
  try {
    const profileTypeId = await getProfileTypeIdByName(profileTypeName);
    if (!profileTypeId) {
      console.warn(
        `Profile type "${profileTypeName}" not found. Available types can be checked with getProfileTypes()`
      );
      return [];
    }
    return await getProfilesByType(profileTypeId, page, pageSize);
  } catch (error) {
    console.error(`Error fetching profiles by type name "${profileTypeName}":`, error);
    return [];
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
  const query = getClient().query;
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

  const { data, error } = await query({
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
        const { data } = await query({
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
  const { data, error } = await query({
    query: gql(/* gql */ `
      query AllProfileTypes {
        termProfileTypes(first: 100) {
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
