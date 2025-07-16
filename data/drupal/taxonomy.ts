import { gql } from "@/lib/graphql";

export const NAVIGATION_FRAGMENT = gql(/* gql */ `
  fragment Navigation on TermPrimaryNavigation {
    menuName
  }
`);

export const SECTION_COLUMN_FRAGMENT = gql(/* gql */ `
  fragment SectionColumn on TermSectionColumn {
    name
  }
`);

export const SPECIAL_REGIONS_FRAGMENT = gql(/* gql */ `
  fragment SpecialRegions on TermSpecialRegion {
    name
  }
`);

export const TAG_FRAGMENT = gql(/* gql */ `
  fragment Tag on TermTag {
    id
    name
  }
`);

export const UNIT_FRAGMENT = gql(/* gql */ `
  fragment Unit on TermUnit {
    id
    name
  }
`);

export const NEWS_CATEGORY_FRAGMENT = gql(/* gql */ `
  fragment NewsCategory on TermNewsCategory {
    id
    name
  }
`);

export const PROFILE_TYPE_FRAGMENT = gql(/* gql */ `
  fragment ProfileType on TermProfileType {
    name
  } 
`);

export const GOAL_FRAGMENT = gql(/* gql */ `
  fragment Goal on TermGoal {
    id
    name
    action
  }
`);

export async function getProfileTypes() {
  const { data } = await query({
    query: gql(/* GraphQL */ `
      ${PROFILE_TYPE_FRAGMENT}
      query GetProfileTypes {
        profileTypes {
          ...ProfileType
        }
      }
    `),
  });
  if (!data.profileTypes) {
    return [];
  }
  return data.profileTypes;
}

export async function getUnits() {
  const { data } = await query({
    query: gql(/* GraphQL */ `
      ${UNIT_FRAGMENT}
      query GetUnits {
        units {
          ...Unit
        }
      }
    `),
  });

  if (!data?.units) {
    return [];
  }

  return data.units;
}
