import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type {
  AdmissionLocationFragment,
  UndergraduateAdmissionRequirementFragment,
  UndergraduateAdmissionStudentTypeFragment,
  UndergraduateAdmissionRequirementSectionFragment,
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

export const UNDERGRADUATE_ADMISSION_REQUIREMENT_SIDEBAR_BUTTON_FRAGMENT = gql(/* gql */ `
  fragment UndergraduateAdmissionRequirementSidebarButton on ParagraphUndergradReqSidebarButton {
    __typename
    id
    link {
      title
      url
    }
    fontAwesomeIcon
  }
`);

export const UNDERGRADUATE_ADMISSION_REQUIREMENT_SECTION_FRAGMENT = gql(/* gql */ `
  fragment UndergraduateAdmissionRequirementSection on ParagraphUndergradReqsSection {
    __typename
    type {
      ... on TermUndergradReqSecType {
        name
      }
    }
    overrides
    content {
      processed
    }
  }
`);

export const UNDERGRADUATE_ADMISSION_REQUIREMENT_FRAGMENT = gql(/* gql */ `
  fragment UndergraduateAdmissionRequirement on NodeUndergraduateRequirement {
    __typename
    title
    path
    type {
      __typename
    }
    location {
      __typename
    }
    program {
      __typename
    }
    sidebar {
      ...UndergraduateAdmissionRequirementSidebarButton
    }
    sections {
      ...UndergraduateAdmissionRequirementSection
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

export async function getUndergraduateAdmissionRequirementPageContent(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {
  const showUnpublished = await showUnpublishedContent();
  const requirements = await getUndergraduateAdmissionRequirements(studentType, location, program);

  const paths = requirements.map((requirement) => ({
    title: requirement.title,
    url: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${requirement.path}`,
  }));

  const { sidebar } = requirements
    // Filter out requirements that have no sidebar
    .filter((requirement) => !!requirement.sidebar)
    // Create an array of only sidebars
    .map((requirement) => requirement.sidebar)
    // Flatten the array so we have one big array of sidebar content
    .flat()
    // Remove any null content from that array
    .filter((value) => !!value)
    // Remove content with a duplicate title; since the original array is sorted by rank, the content from the highest ranking requirement will appear in the final array.
    .reduce(
      (acc, value) => {
        const title = value.link.title;

        if (title && !acc.titles.has(title)) {
          acc.sidebar.push(value);
        }

        return acc;
      },
      {
        sidebar: [] as NonNullable<UndergraduateAdmissionRequirement["sidebar"]>,
        titles: new Set<string>(),
      }
    );

  const sections = requirements
    .filter((requirement) => !!requirement.sections)
    .map((requirement) => requirement.sections)
    .flat()
    .filter((value) => !!value)
    .reduce((acc, value) => {
      const sections = acc.get(value.type.name);

      return acc;
    }, new Map<string, NonNullable<UndergraduateAdmissionRequirement["sections"]>[0]>());

  console.log(sections);

  return {
    sidebar: sidebar,
    paths: showUnpublished ? paths : null,
    sections: [],
  };
}

export async function getDefaultSidebar() {}
