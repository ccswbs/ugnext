import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { handleGraphQLError, query, getClient } from "@/lib/apollo";
import type { FullProfile } from "@/lib/types";
import type { 
  ProfilesResult,
  NodeProfile 
} from "@/lib/graphql/graphql";

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
  try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL */ `
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
  }
}

export async function getProfilesByType(profileType: string, page: number = 0, pageSize: number = 100) {
  try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL */ `
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
  }
}

export async function getProfilesByUnit(unitId: string, page: number = 0, pageSize: number = 100) {
  try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL */ `
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
}

export async function getProfilesByUnitPaginated(unitId: string, page: number = 0, pageSize: number = 20, searchTerm?: string) {
  try {
    const client = getClient();
    
    // If we have a search term, fetch ALL profiles from this unit to search through
    const actualPageSize = searchTerm ? 1000 : pageSize; // Fetch many more profiles when searching
    const actualPage = searchTerm ? 0 : page; // Always start from page 0 when searching
    
    const { data } = await client.query({
      query: gql(/* GraphQL */ `
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
    console.error(`Error fetching paginated profiles by unit "${unitId}":`, error);
    return {
      results: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }
}

export async function getProfilesByTag(tagName: string) {
  try {
    const client = getClient();
    const profilesQuery = gql(/* GraphQL */ `
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
  }
}

export async function getProfileCount() {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: gql(/* GraphQL */ `
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
  }
}



export async function getProfilesPaginated(page: number = 0, pageSize: number = 20, searchTerm?: string) {
  try {
    const client = getClient();
    
    // If we have a search term, fetch ALL profiles to search through
    const actualPageSize = searchTerm ? 1000 : pageSize; // Fetch many more profiles when searching
    const actualPage = searchTerm ? 0 : page; // Always start from page 0 when searching
    
    const { data } = await client.query({
      query: gql(/* GraphQL */ `
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
  }
}

export async function getProfileTypes() {
  const client = getClient();
  const { data } = await client.query({
    query: gql(/* GraphQL */ `
      query GetProfileTypes {
        taxonomyTerms(filter: {vid: "profile_type"}) {
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

export async function getResearch() {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: gql(/* GraphQL */ `
        query GetResearch {
          taxonomyTerms(filter: {vid: "research"}) {
            results {
              ... on TermResearch {
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

    return (data as any).taxonomyTerms.results
      .filter((term: any): term is { id: string; name: string } => 'name' in term)
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching research terms:", error);
    return [];
  }
}

export async function getTags() {
  const client = getClient();
  const { data } = await client.query({
    query: gql(/* GraphQL */ `
      query GetTags {
        taxonomyTerms(filter: {vid: "tags"}) {
          results {
            ... on TermTag {
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

  return (data as any).taxonomyTerms.results
    .filter((term: any): term is { id: string; name: string } => 'name' in term)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
}

export async function getUnits() {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: gql(/* GraphQL */ `
        query GetUnits {
          taxonomyTerms(filter: {vid: "units"}) {
            results {
              ... on TermUnit {
                id
                name
                parent {
                  ... on TermUnit {
                    name
                  }
                }
              }
            }
          }
        }
      `),
    });

    if (!(data as any)?.taxonomyTerms?.results) {
      return [];
    }

    return (data as any).taxonomyTerms.results
      .filter((term: any): term is { id: string; name: string } => 'name' in term)
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
}