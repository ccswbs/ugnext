import { gql } from "@/lib/graphql";
import { query } from "@/lib/apollo";
import { slugify } from "@/lib/string-utils";
import { UnitFragment } from "@/lib/graphql/types";

export const GOAL_FRAGMENT = gql(/* gql */ `
  fragment Goal on TermGoal {
    id
    name
    action
  }
`);

export const NAVIGATION_FRAGMENT = gql(/* gql */ `
  fragment Navigation on TermPrimaryNavigation {
    __typename
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
    path
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

export const UNIWEB_FRAGMENT = gql(/* gql */ `
  fragment UniwebPart on TermUniwebProfilePart {
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
    acronym
    name
    parent {
      __typename
      ... on TermUnit {
        acronym
        name
      }
    }
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

export async function getAllUnits() {
  const unitQuery = gql(/* gql */ `
    query GetAllTermUnits($cursor: Cursor) {
      termUnits(first: 100, after: $cursor) {
        nodes {
          ...Unit
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const units: UnitFragment[] = [];

  while (hasNextPage) {
    const { data, error } = await query({
      query: unitQuery,
      variables: {
        cursor: cursor,
      },
    });

    if (error) {
      console.error(`GraphQL Error: failed to retrieve units in getAllUnits: ${error}`);
      return units;
    }

    if (!data) {
      break;
    }

    units.push(...data.termUnits.nodes);
    hasNextPage = data?.termUnits.pageInfo.hasNextPage ?? false;
  }

  return units;
}

export async function getUnitBySlugifiedName(name: string) {
  const units = await getAllUnits();
  return units.find((unit) => slugify(unit.name) === name.toLowerCase());
}
