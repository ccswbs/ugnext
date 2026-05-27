import { GraduateProgramVariant } from "@/lib/types/graduate-program-variant";
import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import {
  GraduateDegreeTypeFragment,
  GraduateProgramVariantFragment,
  GraduateProgramDurationFragment,
  GraduateEntryApplicationDeadlineFragment,
} from "@/lib/graphql/types";
import { toTitleCase } from "@/lib/string-utils";


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

export function parseGraduateDegreeTypes(degreeTypesData: GraduateDegreeTypeFragment[] | null | undefined) {
  if (!degreeTypesData) {
    return null;
  }

  const uniqueDegreeTypes = [...new Set(degreeTypesData.flatMap(
    item => item.degreeType !== null ? item.degreeType : []))];

  return uniqueDegreeTypes;
}

export async function getGraduateDegreeTypes() {
  const { data, error } = await query({
    query: gql(/* gql */ `
      query GraduateDegreeTypes {
        termGraduateDegreeTypes(first: 100) {
          nodes {
            ...GraduateDegreeType
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

  return parseGraduateDegreeTypes(data.termGraduateDegreeTypes.nodes);
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

export const GRADUATE_PROGRAM_VARIANT = gql(/* gql */ `
  fragment GraduateProgramVariant on NodeGraduateProgramVariant {
    __typename
    id
    graduateProgramCode
    graduateProgramDegree {
      ...GraduateDegreeType
    }
    graduateProgramType {
      ...GraduateProgramType
    }
    graduateDelivery {
      ...GraduateDelivery
    }
    admissionAverageLetter
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
  }
`);

export function parseGraduateProgramVariant(program: GraduateProgramVariantFragment | null | undefined) {
  if (!program) {
    return null;
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

  parseDuration(program.durationFullTime ?? [], "full-time");
  parseDuration(program.durationPartTime ?? [], "part-time");
  parseDeadlines(program.graduateProgramEntryApp ?? []);

  return {
    code: program.graduateProgramCode ?? "",
    degree: {
      ...program.graduateProgramDegree,
      acronym: program.graduateProgramDegree.acronym ?? undefined,
    },
    type: program.graduateProgramType,
    delivery: program.graduateDelivery,
    average: {
      letterGrade: program.admissionAverageLetter ?? undefined,
      maxPercentage: program.admissionAverageMaxPerc ?? undefined,
      minPercentage: program.admissionAverageMinPerc ?? undefined,
    },
    duration: duration,
    deadlines: deadlines,
  };
}

async function getGraduateProgramById(id: string): Promise<GraduateProgramVariant | null> {
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

export default getGraduateProgramById;
