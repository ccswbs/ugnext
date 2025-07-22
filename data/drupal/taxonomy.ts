import { gql } from "@/lib/graphql";

export const GOAL_FRAGMENT = gql(/* gql */ `
  fragment Goal on TermGoal {
    id
    name
    action
  }
`);

export const NAVIGATION_FRAGMENT = gql(/* gql */ `
  fragment Navigation on TermPrimaryNavigation {
    menuName
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
    id
    name
  } 
`);

export const RESEARCH_FRAGMENT = gql(/* gql */ `
  fragment Research on TermResearch {
    id
    name
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
