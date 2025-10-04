import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { query } from "@/lib/apollo";

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

  const { data } = await query({
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

  if (!data?.nodeProfile) {
    return null;
  }

  if (data.nodeProfile.status === false && !showUnpublished) {
    return null;
  }

  return {
    ...data.nodeProfile,
  };
}

export async function getProfiles() {
  try {
    const profilesQuery = gql(/* GraphQL */ `
      query GetProfiles($page: Int = 0, $pageSize: Int = 100) {
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

    let page = 0;
    const pageSize = 100;
    const profiles: any[] = [];
    let total = 0;
    let totalPages = 1;

    do {
      const { data } = await query({
        query: profilesQuery,
        variables: {
          page,
          pageSize,
        },
      });

      if (!data?.profiles?.results) {
        break;
      }

      profiles.push(...data.profiles.results);
      total = data.profiles.pageInfo?.total || 0;
      totalPages = Math.ceil(total / pageSize);
      page++;
    } while (page < totalPages);

    return profiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

export async function getProfilesByType(profileType: string) {
  try {
    const profilesQuery = gql(/* GraphQL */ `
      query GetProfilesByType($type: String!, $page: Int = 0, $pageSize: Int = 100) {
        profiles(filter: { field_profile_type_target_id: $type }, page: $page, pageSize: $pageSize) {
          results {
            ... on NodeProfile {
              id
              title
              path
              profileJobTitle
              profileFirstName
              profileLastName
              profileType {
                id
                name
              }
              profileUnit {
                id
                name
              }
              profileResearchAreas {
                ...Research
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

    let page = 0;
    const pageSize = 100;
    const profiles: any[] = [];
    let total = 0;
    let totalPages = 1;

    do {
      const { data } = await query({
        query: profilesQuery,
        variables: {
          type: profileType,
          page,
          pageSize,
        },
      });

      if (!data?.profiles?.results) {
        break;
      }

      profiles.push(...data.profiles.results);
      total = data.profiles.pageInfo?.total || 0;
      totalPages = Math.ceil(total / pageSize);
      page++;
    } while (page < totalPages);

    return profiles;
  } catch (error) {
    console.error(`Error fetching profiles by type "${profileType}":`, error);
    return [];
  }
}

/* Enhance this with an additional function to check the initial unitName for a parent
Add people into an array for the parent unit? */
export async function getProfilesByUnit(unitName: string) {
  try {
    const profilesQuery = gql(/* GraphQL */ `
      query GetProfilesByUnit($unit: String!, $page: Int = 0, $pageSize: Int = 100) {
        profiles(filter: { field_profile_unit_target_id: $unit }, page: $page, pageSize: $pageSize) {
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
    const pageSize = 100;
    const profiles: any[] = [];
    let total = 0;
    let totalPages = 1;

    do {
      const { data } = await query({
        query: profilesQuery,
        variables: {
          unit: unitName,
          page,
          pageSize,
        },
      });

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
    console.error(`Error fetching profiles by unit "${unitName}":`, error);
    return { results: [] };
  }
}

export async function getProfilesByTag(tagName: string) {
  try {
    const profilesQuery = gql(/* GraphQL */ `
      query GetProfilesByTag($tag: String!, $page: Int = 0, $pageSize: Int = 100) {
        profiles(filter: { field_tags_target_id: $tag }, page: $page, pageSize: $pageSize) {
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
    const pageSize = 100;
    const profiles: any[] = [];
    let total = 0;
    let totalPages = 1;

    do {
      const { data } = await query({
        query: profilesQuery,
        variables: {
          tag: tagName,
          page,
          pageSize,
        },
      });

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
    const { data } = await query({
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
    });

    return data?.profiles?.pageInfo?.total || 0;
  } catch (error) {
    console.error("Error fetching profile count:", error);
    return 0;
  }
}



export async function getProfilesPaginated(page: number = 0, pageSize: number = 20) {
  try {
    const { data } = await query({
      query: gql(/* GraphQL */ `
        query GetProfilesPaginated($page: Int = 0, $pageSize: Int = 20) {
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
      `) as any,
      variables: {
        page,
        pageSize,
      },
    });

    if (!data?.profiles) {
      return {
        results: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const total = data.profiles.pageInfo?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      results: data.profiles.results,
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
  const { data } = await query({
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
  
  if (!data?.taxonomyTerms?.results) {
    return [];
  }
  
  return data.taxonomyTerms.results;
}

export async function getResearch() {
  try {
    const { data } = await query({
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

    if (!data?.taxonomyTerms?.results) {
      return [];
    }

    return data.taxonomyTerms.results
      .filter((term: any): term is { id: string; name: string } => 'name' in term)
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching research terms:", error);
    return [];
  }
}

export async function getTags() {
  const { data } = await query({
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

  if (!data?.taxonomyTerms?.results) {
    return [];
  }

  return data.taxonomyTerms.results
    .filter((term): term is { id: string; name: string } => 'name' in term)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getUnits() {
  try {
    const { data } = await query({
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

    if (!data?.taxonomyTerms?.results) {
      return [];
    }

    return data.taxonomyTerms.results
      .filter((term: any): term is { id: string; name: string } => 'name' in term)
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
}