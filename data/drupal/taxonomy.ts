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

export const GOAL_FRAGMENT = gql(/* gql */ `
  fragment Goal on TermGoal {
    id
    name
    action
  }
`);

export const UNDERGRADUATE_DEGREE_TYPES = gql(/* gql */ `
  fragment UndergraduateDegreeType on TermUndergraduateDegreeType {
    id
    name
  }
`);

export const UNDERGRADUATE_PROGRAM_TYPES = gql(/* gql */ `
  fragment UndergraduateProgramType on TermUndergraduateProgramType {
    id
    name
  }
`);

export const UNDERGRADUATE_PROGRAM_SEARCH_TAG = gql(/* gql */ `
  fragment UndergraduateProgramSearchTag on TermUndergraduateProgramSearchTag {
    name
  }
`);

export const ADMISSION_STUDENT_TYPE = gql(/* gql */ `
  fragment AdmissionStudentType on TermAdmissionLocation {
    id
    name
  }
`);

export const ADMISSION_LOCATION = gql(/* gql */ `
  fragment AdmissionLocation on TermAdmissionLocation {
    id
    name
    type
  }
`);

export const UNDERGRADUATE_ADMISSION_REQUIREMENT_SECTION_TYPE = gql(/* gql */ `
  fragment UndergraduateAdmissionRequirementSectionType on TermUndergradReqSecType {
    id
    name
  }
`);
