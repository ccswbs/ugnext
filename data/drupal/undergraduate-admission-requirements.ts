import { query } from "@/lib/apollo";
import { gql } from "@/lib/graphql";
import type {
  AdmissionLocationFragment,
  UndergraduateAdmissionRequirementFragment,
  UndergraduateAdmissionStudentTypeFragment,
  UndergraduateAdmissionRequirementSectionFragment,
  TermAdmissionLocation,
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

export type UndergraduateAdmissionLocationType = "domestic" | "international" | "curriculum";

export type UndergraduateAdmissionLocation = AdmissionLocationFragment & {
  type: UndergraduateAdmissionLocationType;
};

export async function getUndergraduateAdmissionLocations() {
  const locationsQuery = gql(/* gql */ `
    query UndergraduateAdmissionLocations($after: Cursor = "") {
      termAdmissionLocations(first: 100, after: $after) {
        nodes {
          __typename
          ...AdmissionLocation
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const locations: UndergraduateAdmissionLocation[] = [];

  while (hasNextPage) {
    const { data } = await query({
      query: locationsQuery,
      variables: {
        after: cursor,
      },
    });

    const values = data.termAdmissionLocations.nodes
      .filter((node) => !!node.parent)
      .map((node) => {
        const typeMap: Record<string, UndergraduateAdmissionLocationType> = {
          Countries: "international",
          Curriculums: "curriculum",
          "Provinces and Territories": "domestic",
        };

        const parent = node.parent as TermAdmissionLocation;

        return {
          ...node,
          type: typeMap[parent.name] ?? "international",
        };
      });

    locations.push(...values);
    hasNextPage = data.termAdmissionLocations.pageInfo.hasNextPage;
    cursor = data.termAdmissionLocations.pageInfo.endCursor;
  }

  return locations;
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
    status
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

export async function getUndergraduateAdmissionRequirementIDs(
  studentType?: UndergraduateAdmissionStudentType,
  location?: UndergraduateAdmissionLocation,
  program?: UndergraduateProgram
) {
  const { data } = await query({
    query: gql(/* gql */ `
      query UndergraduateAdmissionRequirementsIDs($studentType: String, $location: String, $program: Float) {
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
      studentType: studentType?.name ?? null,
      location: location?.name ?? null,
      program: program ? Number.parseFloat(program.id) : null,
    },
  });

  return (
    data?.undergraduateAdmissionRequirements?.results
      .map((result) => (result.__typename === "NodeUndergraduateRequirement" ? result.id : null))
      .filter((id) => id !== null) ?? []
  );
}

export async function getUndergraduateAdmissionRequirementsByID(ids: string[]) {
  const showUnpublished = await showUnpublishedContent();
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

export async function getUndergraduateAdmissionRequirements(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {
  const ids = await getUndergraduateAdmissionRequirementIDs(studentType, location, program);
  return await getUndergraduateAdmissionRequirementsByID(ids);
}

export type UndergraduateAdmissionRequirementSidebar = NonNullable<UndergraduateAdmissionRequirement["sidebar"]>;
export type UndergraduateAdmissionRequirementSection = {
  title: string;
  content: string;
};

async function getUndergraduateAdmissionRequirementPageContentByID(ids: string[]) {
  const showUnpublished = await showUnpublishedContent();
  const requirements = await getUndergraduateAdmissionRequirementsByID(ids);

  const paths: { title: string; url: string }[] = [];
  const sidebarTitles = new Set<string>();
  const sidebar: UndergraduateAdmissionRequirementSidebar = [];
  const sectionsMap = new Map<string, NonNullable<UndergraduateAdmissionRequirement["sections"]>>();

  for (const requirement of requirements) {
    if (requirement === null) {
      continue;
    }

    if (!requirement.status && !showUnpublished) {
      continue;
    }

    paths.push({
      title: requirement.title,
      url: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${requirement.path}`,
    });

    // Only include the higher ranking sidebar buttons if there are multiple with the same title.
    if (requirement.sidebar && requirement.sidebar.length > 0) {
      for (const button of requirement.sidebar) {
        if (button.link.title && !sidebarTitles.has(button.link.title)) {
          sidebar.push(button);
          sidebarTitles.add(button.link.title);
        }
      }
    }

    if (requirement.sections && requirement.sections.length > 0) {
      for (const section of requirement.sections) {
        const type =
          section.type.name === "General Requirements" || section.type.name === "Program Requirements"
            ? "Admission Requirements"
            : section.type.name;

        if (!sectionsMap.has(type)) {
          sectionsMap.set(type, []);
        }

        sectionsMap.get(type)?.push(section);
      }
    }
  }

  const sections: UndergraduateAdmissionRequirementSection[] = [];

  for (const entry of sectionsMap.entries()) {
    const overrideIndex = entry[1].findIndex((section) => section.overrides === true);

    const reducedSections = overrideIndex === -1 ? entry[1] : entry[1].slice(0, overrideIndex + 1);

    const content = reducedSections.map((section) => (section.content?.processed as string) ?? "").join("");

    sections.push({
      title: entry[0],
      content: content,
    });
  }

  return {
    sidebar: sidebar,
    paths: paths,
    sections: sections,
  };
}

export async function getUndergraduateAdmissionRequirementPageContent(
  studentType: UndergraduateAdmissionStudentType,
  location: UndergraduateAdmissionLocation,
  program: UndergraduateProgram
) {
  const ids = await getUndergraduateAdmissionRequirementIDs(studentType, location, program);
  return await getUndergraduateAdmissionRequirementPageContentByID(ids);
}

export async function getGeneralAdmissionRequirementPageContent() {
  const ids = await getUndergraduateAdmissionRequirementIDs();
  return await getUndergraduateAdmissionRequirementPageContentByID(ids);
}
