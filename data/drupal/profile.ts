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
    uniwebId
    body {
      processed
    }
    profileType {
      ...ProfileType
    }
    profileSections {
      ... on ParagraphProfilePart {
        id
        profilePartText {
          processed
        }
        profilePartLabel
      }
    }
    profilePicture {
      ...Image
    }
    tags {
      ...Tag
      ...Unit
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

export async function getProfileCount() {
  const { data } = await query({
    query: gql(/* gql */ `
      query GetProfileCount {
        profiles(page: 0) {
          pageInfo {
            total
            pageSize
          }
        }
      }
    `),
  });

  if (!data?.profiles) {
    return 0;
  }

  return data.profiles.pageInfo.total;
}

export async function getProfilesByType(profileType: string) {
  const { data } = await query({
    query: gql(/* GraphQL */ `
      query GetProfilesByType($type: String!) {
        profiles(filter: { field_profile_type_target_id: $type }) {
          results {
            ... on NodeProfile {
              id
              title
              path
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
      type: profileType,
    },
  });

  if (!data?.profiles) {
    return { results: [] };
  }

  return data.profiles;
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
              profileType {
                name
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
