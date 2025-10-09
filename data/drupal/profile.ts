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
    const { data } = await query({
      query: gql(/* GraphQL */ `
        query GetProfiles {
          profiles {
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
          }
        }
      `),
    });

    if (!data?.profiles?.results) {
      return [];
    }

    return data.profiles.results;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

export async function getProfilesByType(profileType: string) {
  try {
    const { data } = await query({
      query: gql(/* GraphQL */ `
        query GetProfilesByType($type: String!) {
          profiles(filter: { field_profile_type_target_id: $type }) {
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
          }
        }
      `),
      variables: {
        type: profileType,
      },
    });

    if (!data?.profiles?.results) {
      return [];
    }

    return data.profiles.results;
  } catch (error) {
    console.error(`Error fetching profiles by type "${profileType}":`, error);
    return [];
  }
}

/* Enhance this with an additional function to check the initial unitName for a parent
Add people into an array for the parent unit? */
export async function getProfilesByUnit(unitName: string) {
  const { data } = await query({
    query: gql(/* GraphQL */ `
      query GetProfilesByUnit($unit: String!) {
        profiles(filter: { field_profile_unit_target_id: $unit }) {
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
        }
      }
    `),
    variables: {
      unit: unitName,
    },
  });

  if (!data?.profiles) {
    return { results: [] };
  }

  return data.profiles;
}

export async function getProfilesByTag(tagName: string) {
  const { data } = await query({
    query: gql(/* GraphQL */ `
      query GetProfilesByTag($tag: String!) {
        profiles(filter: { field_tags_target_id: $tag }) {
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
        }
      }
    `),
    variables: {
      tag: tagName,
    },
  });

  if (!data?.profiles) {
    return { results: [] };
  }

  return data.profiles;
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