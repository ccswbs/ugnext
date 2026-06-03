import { GraduateProgramVariant, GraduateProgramRelatedLink } from "@/lib/types/graduate-program-variant";
import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import {
  GraduateProgramDegreeTypeFragment,
  GraduateProgramSearchableTypeFragment,
  GraduateProgramTypeFragment,
  GraduateProgramVariantFragment,
  GraduateProgramVariantsQuery,
  GraduateProgramDurationFragment,
  GraduateProgramLinkFragment,
  GraduateEntryApplicationDeadlineFragment,
} from "@/lib/graphql/types";
import { toTitleCase } from "@/lib/string-utils";

export type GraduateDegreeType = GraduateProgramDegreeTypeFragment;
export type GraduateProgramSearchableType = GraduateProgramSearchableTypeFragment;
export type GraduateProgramType = GraduateProgramTypeFragment;

export type GraduateProgramVariantResult = GraduateProgramVariant & {
  __typename: "GraduateProgram",
  id: string;
  title: string;
  url: string;
  degrees: {
    __typename: "GraduateDegree";
    id: string;
    title: string;
    acronym?: string;
  }[],
  tags: string[];
};

function parse(variant: GraduateProgramVariantFragment) {
  const uniqueTypes = [...new Set(variant.graduateProgramType.flatMap(
    item => item.searchableType !== null ? item.searchableType : []))];

  return {
    __typename: "GraduateProgram",
    id: variant.id,
    title: variant.graduateProgramGrouping.name,
    url: variant.programUrl?.url ?? "",
    type: uniqueTypes,
    degrees: [
      {
      __typename: "GraduateDegree",
      id: variant.graduateProgramDegree.id,
      title: variant.graduateProgramDegree.name,
      acronym: variant.graduateProgramDegree.acronym,
    }],
    tags: variant?.graduateProgramGrouping.tags?.map((tag) => tag.name) ?? [],
  } as GraduateProgramVariantResult;
}

async function getDraftGraduateProgramVariants() {
  const variantsQuery = gql(/* gql */ `
    query DraftGraduatePrograms($pageSize: Int = 100, $page: Int = 0) {
      latestContentRevisions(filter: { type: "graduate_program_variant" }, pageSize: $pageSize, page: $page) {
        pageInfo {
          total
        }
        results {
          __typename
          ...GraduateProgramVariant
        }
      }
    }
  `);

  const variants: GraduateProgramVariantsQuery["nodeGraduateProgramVariants"]["nodes"] = [];
  const pageSize = 100;
  let page = 0;
  let total = 1;

  while (page < total) {
    const { data, error } = await query({
      query: variantsQuery,
      variables: {
        pageSize,
        page,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    for (const variant of data?.latestContentRevisions?.results ?? []) {
      if (variant.__typename === "NodeGraduateProgramVariant") {
        variants.push(variant);
      }
    }

    total = Math.ceil((data?.latestContentRevisions?.pageInfo?.total ?? 0) / pageSize);
    page++;
  }

  return variants.map(parse);
}

async function getPublishedGraduateProgramVariants() {
  const variantsQuery = gql(/* gql */ `
    query GraduateProgramVariants($after: Cursor = "") {
      nodeGraduateProgramVariants(after: $after, first: 100) {
        nodes {
          ...GraduateProgramVariant
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const variants: GraduateProgramVariantsQuery["nodeGraduateProgramVariants"]["nodes"] = [];

  while (hasNextPage) {
    const { data, error } = await query({
      query: variantsQuery,
      variables: {
        after: cursor,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    if (data) {
      variants.push(...data.nodeGraduateProgramVariants.nodes);
      cursor = data.nodeGraduateProgramVariants.pageInfo.endCursor;
      hasNextPage = data.nodeGraduateProgramVariants.pageInfo.hasNextPage;
    } else {
      hasNextPage = false;
      console.warn("Graduate Program Variants: failed to retrieve all programs, showing partial results");
    }
  }

  return variants.filter((variant) => variant.status).map(parse);
}

export async function getGraduateProgramVariants() {
  if (await showUnpublishedContent()) {
    return await getDraftGraduateProgramVariants();
  }

  return await getPublishedGraduateProgramVariants();
}

export async function getGraduatePrograms() {
  const { data, error } = await query({
    query: gql(/* gql */ `
      query GraduatePrograms {
        termGraduatePrograms(first: 100) {
          nodes {
            ...GraduateProgram
          }
        }
      }
    `),
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  return data.termGraduatePrograms.nodes;
}

export async function getGraduateProgramSearchableTypes() {
  const { data, error } = await query({
    query: gql(/* gql */ `
      query GraduateProgramSearchableTypes {
        termGraduateProgramSearchableTypes(first: 20) {
          nodes {
            ...GraduateProgramSearchableType
          }
        }
      }
    `),
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  return data.termGraduateProgramSearchableTypes.nodes;
}

export async function getGraduateProgramDegreeTypes() {
  const { data, error } = await query({
    query: gql(/* gql */ `
      query GraduateProgramDegreeTypes {
        termGraduateProgramDegreeTypes(first: 100) {
          nodes {
            ...GraduateProgramDegreeType
          }
        }
      }
    `),
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  return data.termGraduateProgramDegreeTypes.nodes
}

export const GRADUATE_ENTRY_APPLICATION_DEADLINE = gql(/* gql */ `
  fragment GraduateEntryApplicationDeadline on ParagraphGraduateProgramEntryApplicati {
    entryTerm {
      name
    }
    entryTermYear {
      name
    }
    domesticMonthDay {
      time
    }
    domesticYear {
      name
    }
    domesticOngoing
    domesticAppDedInfo
    internationalMonthDay {
      time
    }
    internationalYear {
      name
    }
    internationalOngoing
    internationalAppDedInfo
  }
`);

export const GRADUATE_PROGRAM_DURATION = gql(/* gql */ `
  fragment GraduateProgramDuration on ParagraphGraduateProgramDuration {
    durationMaximum
    durationMinimum
    durationType {
      ...GraduateProgramType
    }
  }
`);

export const GRADUATE_PROGRAM_LINK = gql(/* gql */ `
  fragment GraduateProgramLink on ParagraphGraduateProgramLink {
    graduateRelatedLinkType {
      name
    }
    relatedLink {
      title
      url
    }
  }
`);

export const GRADUATE_PROGRAM_VARIANT = gql(/* gql */ `
  fragment GraduateProgramVariant on NodeGraduateProgramVariant {
    __typename
    id
    status
    title
    programUrl {
      url
      title
    }
    graduateProgramCode
    graduateProgramDegree {
      ...GraduateDegree
    }
    graduateProgramGrouping {
      ...GraduateProgram
    } 
    graduateProgramType {
      ...GraduateProgramType
    }
    graduateDelivery {
      ...GraduateDelivery
    }
    admissionLetterGrade{
      name
    }
    admissionAverageMaxPerc
    admissionAverageMinPerc
    graduateProgramEntryApp {
      ...GraduateEntryApplicationDeadline
    }
    durationFullTime {
      ...GraduateProgramDuration
    }
    durationPartTime {
      ...GraduateProgramDuration
    }
    relatedLinks {
      ...GraduateProgramLink
    }
  }
`);

export function parseGraduateProgramVariant(variant: GraduateProgramVariantFragment | null | undefined) {
  if (!variant) {
    return null;
  }

  const additionalRequirements: GraduateProgramRelatedLink[] = [];
  const programStructure: GraduateProgramRelatedLink[] = [];
  const parseLinks = (variantLinksData: GraduateProgramLinkFragment[], programLinksData: GraduateProgramLinkFragment[]) => {

    // Parse Variants first - these take precedence
    for (const item of variantLinksData) {
      if(item.graduateRelatedLinkType?.name === "Additional Requirements"){
        additionalRequirements.push({
          type: "Additional Requirements",
          title: item.relatedLink?.title ?? "",
          url: item.relatedLink?.url ?? "",
          level: "variant",
        })
      } else if(item.graduateRelatedLinkType?.name === "Program Structure"){
        programStructure.push({
          type: "Program Structure",
          title: item.relatedLink?.title ?? "",
          url: item.relatedLink?.url ?? "",
          level: "variant",
        })
      }
    }

    // Program Links are secondary
    for (const item of programLinksData) {
      if(item.graduateRelatedLinkType?.name === "Additional Requirements"){
        additionalRequirements.push({
          type: "Additional Requirements",
          title: item.relatedLink?.title ?? "",
          url: item.relatedLink?.url ?? "",
          level: "program",
        })
      } else if(item.graduateRelatedLinkType?.name === "Program Structure"){
        programStructure.push({
          type: "Program Structure",
          title: item.relatedLink?.title ?? "",
          url: item.relatedLink?.url ?? "",
          level: "program",
        })
      }
    }
  }

  const duration: GraduateProgramVariant["duration"] = [];
  const deadlines: GraduateProgramVariant["deadlines"] = [];
  const parseDuration = (durationData: GraduateProgramDurationFragment[], durationType: string) => {
    for (const item of durationData) {
      if (!item.durationType) {
        duration.push({
          type: durationType,
          min: item.durationMinimum ?? undefined,
          max: item.durationMaximum,
        });
      }

      for (const type of item.durationType ?? []) {
        duration.push({
          type: durationType,
          min: item.durationMinimum ?? 0,
          max: item.durationMaximum ?? 0,
          programType: type ?? undefined,
        });
      }
    }
  };

  const parseDeadlines = (deadlineData: GraduateEntryApplicationDeadlineFragment[]) => {
    for (const item of deadlineData) {
      if (!item.entryTerm) {
        continue;
      }

      const currentYear = new Date().getFullYear();
      const domesticDate = new Date(item.domesticMonthDay?.time);
      const isValidDomesticDate = !isNaN(domesticDate.getTime());
      const internationalDate = new Date(item.internationalMonthDay?.time);
      const isValidInternationalDate = !isNaN(internationalDate.getTime());

      isValidDomesticDate && domesticDate.setFullYear(Number.parseInt(item.domesticYear?.name ?? "") || currentYear);
      isValidInternationalDate && internationalDate.setFullYear(Number.parseInt(item.internationalYear?.name ?? "") || currentYear);

      deadlines.push({
        term: item.entryTerm?.name,
        date: {
          timestamp: isValidDomesticDate ? domesticDate.toISOString() : "",
          showYear: Boolean(item.domesticYear?.name),
        },
        location: "domestic",
        ongoing: item.domesticOngoing ?? false,
        info: item.domesticAppDedInfo ?? undefined,
      });

      deadlines.push({
        term: item.entryTerm?.name,
        date: {
          timestamp: isValidInternationalDate ? internationalDate.toISOString() : "",
          showYear: Boolean(item.internationalYear?.name),
        },
        location: "international",
        ongoing: item.internationalOngoing ?? false,
        info: item.internationalAppDedInfo ?? undefined,
      });
    }
  };

  parseDuration(variant.durationFullTime ?? [], "full-time");
  parseDuration(variant.durationPartTime ?? [], "part-time");
  parseDeadlines(variant.graduateProgramEntryApp ?? []);
  parseLinks(variant.relatedLinks ?? [], variant.graduateProgramGrouping?.relatedLinks ?? []);

  return {
    code: variant.graduateProgramCode ?? "",
    degree: {
      ...variant.graduateProgramDegree,
      acronym: variant.graduateProgramDegree.acronym ?? undefined,
    },
    type: variant.graduateProgramType,
    delivery: variant.graduateDelivery,
    average: {
      letterGrade: variant.admissionLetterGrade?.name ?? undefined,
      maxPercentage: variant.admissionAverageMaxPerc ?? undefined,
      minPercentage: variant.admissionAverageMinPerc ?? undefined,
    },
    duration: duration,
    deadlines: deadlines,
    additionalRequirements: additionalRequirements ?? undefined,
    programStructure: programStructure ?? undefined,
  };
}

async function getGraduateProgramVariantById(id: string): Promise<GraduateProgramVariant | null> {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GraduateProgramById($id: ID = "", $revision: ID = "") {
        nodeGraduateProgramVariant(id: $id, revision: $revision) {
          ...GraduateProgramVariant
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return null;
  }

  if (!data.nodeGraduateProgramVariant) {
    return null;
  }

  return parseGraduateProgramVariant(data.nodeGraduateProgramVariant);
}

export default getGraduateProgramVariantById;
