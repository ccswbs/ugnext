import { gql } from "@/lib/graphql";

export const NAVIGATION_FRAGMENT = gql(/* gql */ `
  fragment Navigation on TermPrimaryNavigation {
    __typename
    menuName
  }
`);

export const SECTION_COLUMN_FRAGMENT = gql(/* gql */ `
  fragment SectionColumn on TermSectionColumn {
    __typename
    name
  }
`);

export const SPECIAL_REGIONS_FRAGMENT = gql(/* gql */ `
  fragment SpecialRegions on TermSpecialRegion {
    __typename
    name
  }
`);

export const TAG_FRAGMENT = gql(/* gql */ `
  fragment Tag on TermTag {
    __typename
    id
    name
  }
`);

export const UNIT_FRAGMENT = gql(/* gql */ `
  fragment Unit on TermUnit {
    __typename
    id
    name
  }
`);

export const NEWS_CATEGORY_FRAGMENT = gql(/* gql */ `
  fragment NewsCategory on TermNewsCategory {
    __typename
    id
    name
  }
`);

export const GOAL_FRAGMENT = gql(/* gql */ `
  fragment Goal on TermGoal {
    __typename
    id
    name
    action
  }
`);

export const UNDERGRADUATE_DEGREE_TYPES = gql(/* gql */ `
  fragment UndergraduateDegreeType on TermUndergraduateDegreeType {
    __typename
    id
    name
  }
`);

export const UNDERGRADUATE_PROGRAM_TYPES = gql(/* gql */ `
  fragment UndergraduateProgramType on TermUndergraduateProgramType {
    __typename
    id
    name
  }
`);

export const UNDERGRADUATE_PROGRAM_SEARCH_TAG = gql(/* gql */ `
  fragment UndergraduateProgramSearchTag on TermUndergraduateProgramSearchTag {
    __typename
    name
  }
`);

export const ADMISSION_STUDENT_TYPE = gql(/* gql */ `
  fragment UndergraduateAdmissionStudentType on TermUndergraduateStudentType {
    __typename
    id
    name
    path
  }
`);

export const ADMISSION_LOCATION = gql(/* gql */ `
  fragment AdmissionLocation on TermAdmissionLocation {
    __typename
    id
    name
    weight
    parent {
      ... on TermAdmissionLocation {
        name
      }
    }
    path
  }
`);

export const UNDERGRADUATE_ADMISSION_REQUIREMENT_SECTION_TYPE = gql(/* gql */ `
  fragment UndergraduateAdmissionRequirementSectionType on TermUndergradReqSecType {
    __typename
    id
    name
  }
`);
