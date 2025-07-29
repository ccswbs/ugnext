import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type {
  AdmissionLocationFragment,
  UndergraduateAdmissionRequirementFragment,
  UndergraduateAdmissionStudentTypeFragment,
} from "@/lib/graphql/types";
import { getRoute } from "@/data/drupal/route";
import { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";

export type UndergraduateAdmissionStudentType = UndergraduateAdmissionStudentTypeFragment;

export async function getUndergraduateAdmissionStudentTypes() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionStudentTypes {
        termUndergraduateStudentTypes(first: 100) {
          nodes {
            __typename
            ...UndergraduateAdmissionStudentType
          }
        }
      }
    `),
  });

  return data.termUndergraduateStudentTypes.nodes as UndergraduateAdmissionStudentType[];
}

export async function getUndergraduateAdmissionStudentTypeByPath(path: string) {
  const route = await getRoute(path);

  if (!route) {
    return null;
  }

  if (route.__typename !== "RouteInternal") {
    return null;
  }

  if (!route.entity) {
    return null;
  }

  if (route.entity.__typename !== "TermUndergraduateStudentType") {
    return null;
  }

  return route.entity as UndergraduateAdmissionStudentType;
}

export type UndergraduateAdmissionLocation = AdmissionLocationFragment;
export type UndergraduateAdmissionLocationType = "domestic" | "international" | "curriculum";

export async function getUndergraduateAdmissionLocations() {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionLocations {
        termAdmissionLocations(first: 100) {
          nodes {
            __typename
            ...AdmissionLocation
          }
        }
      }
    `),
  });

  return data.termAdmissionLocations.nodes.toSorted((a, b) => {
    const typeOrder = {
      domestic: 0,
      international: 1,
      curriculum: 2,
    };

    const aOrder = a.type in typeOrder ? typeOrder[a.type as UndergraduateAdmissionLocationType] : 3;
    const bOrder = b.type in typeOrder ? typeOrder[b.type as UndergraduateAdmissionLocationType] : 3;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.name.localeCompare(b.name);
  }) as UndergraduateAdmissionLocation[];
}

export async function getUndergraduateAdmissionLocationByPath(path: string) {
  const route = await getRoute(path);

  if (!route) {
    return null;
  }

  if (route.__typename !== "RouteInternal") {
    return null;
  }

  if (!route.entity) {
    return null;
  }

  if (route.entity.__typename !== "TermAdmissionLocation") {
    return null;
  }

  return route.entity as UndergraduateAdmissionLocation;
}

export const UNDERGRADUATE_ADMISSION_REQUIREMENT_FRAGMENT = gql(/* gql */ `
  fragment UndergraduateAdmissionRequirement on NodeUndergraduateRequirement {
    __typename
    title
    path
    type {
      ... on TermUndergraduateStudentType {
        name
      }
    }
    location {
      ... on TermAdmissionLocation {
        name
      }
    }
    program {
      ... on NodeUndergraduateProgram {
        programType: type {
          ... on TermUndergraduateProgramType {
            name
          }
        }
      }
      ... on NodeUndergraduateDegree {
        degreeType: type {
          ... on TermUndergraduateDegreeType {
            name
          }
        }
      }
    }
    sidebar {
      ...Buttons
    }
    sections {
      ... on ParagraphUndergradReqsSection {
        __typename
        type {
          ... on TermUndergradReqSecType {
            name
          }
        }
        overrides
        content {
          __typename
          ...Accordion
          ...Block
          ...GeneralText
          ...ButtonSection
        }
      }
    }
  }
`);

export type UndergraduateAdmissionRequirement = UndergraduateAdmissionRequirementFragment & {
  rank: number;
};

export async function getUndergraduateAdmissionRequirements(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {
  const showUnpublished = await showUnpublishedContent();

  const { data: idResults } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionRequirementsIDs($studentType: String!, $location: String!, $program: Float) {
        undergraduateAdmissionRequirements(
          filter: { student_type: $studentType, location: $location, program: $program }
        ) {
          results {
            ... on NodeUndergraduateRequirement {
              id: uuid
            }
          }
        }
      }
    `),
    variables: {
      studentType: studentType.name,
      location: location.name,
      program: Number.parseFloat(program.id),
    },
  });

  const ids =
    idResults?.undergraduateAdmissionRequirements?.results
      .map((result) => (result.__typename === "NodeUndergraduateRequirement" ? result.id : null))
      .filter((id) => id !== null) ?? [];

  const requirementsQuery = gql(/* gql */ `
    query UndergraduateAdmissionRequirement($id: ID!, $revision: ID!) {
      nodeUndergraduateRequirement(id: $id, revision: $revision) {
        ...UndergraduateAdmissionRequirement
      }
    }
  `);

  const requirementPromises = ids.map((id) => {
    return query({
      query: requirementsQuery,
      variables: {
        id: id,
        revision: showUnpublished ? "latest" : "current",
      },
    });
  });

  return (
    (await Promise.all(requirementPromises))
      // Add the rank to each requirement
      .map((result) => {
        let rank = 0;
        let requirement = result.data.nodeUndergraduateRequirement;

        if (!requirement) {
          return null;
        }

        for (const field of ["type", "location", "program"]) {
          const value = requirement[field as keyof typeof requirement];

          if (value === null) {
            rank += 2;
          }

          if (Array.isArray(value) && value.length > 1) {
            rank += 1;
          }
        }

        return {
          ...requirement,
          rank: rank,
        } as UndergraduateAdmissionRequirement;
      })
      // Remove nulls
      .filter((requirement) => requirement !== null)
      // Sort by rank
      .sort((a, b) => a.rank - b.rank)
  );
}

export type UndergraduateAdmissionRequirementPageContent = {
  sidebar: NonNullable<UndergraduateAdmissionRequirement["sidebar"]>;
  sections: NonNullable<UndergraduateAdmissionRequirement["sections"]>;
  paths: {
    title: string;
    url: string;
  }[];
};

export async function getUndergraduateAdmissionRequirementPageContent(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {
  const requirements = await getUndergraduateAdmissionRequirements(studentType, location, program);

  const sidebarButtonTitles = new Set<string>();

  return requirements.reduce(
    (acc, requirement) => {
      acc.paths.push({
        title: requirement.title,
        url: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${requirement.path}`,
      });

      if (requirement?.sidebar) {
        for (const button of requirement.sidebar) {
          const buttonTitle = button.link?.title ?? (button.formattedTitle?.processed as string);

          if (!buttonTitle) {
            continue;
          }

          if (sidebarButtonTitles.has(buttonTitle)) {
            continue;
          }

          sidebarButtonTitles.add(buttonTitle);
          acc.sidebar.push(button);
        }
      }

      if (requirement?.sections) {
        acc.sections.push(...requirement.sections);
      }

      return acc;
    },
    {
      sidebar: [],
      sections: [],
      paths: [],
    } as UndergraduateAdmissionRequirementPageContent
  );
}

export async function getDefaultSidebar() {}
