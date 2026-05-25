import { GraduateProgram } from "@/lib/types/graduate-program";
import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import {
  GraduateProgramFragment,
  GraduateProgramDurationFragment,
  GraduateEntryApplicationDeadlineFragment,
} from "@/lib/graphql/types";
import { toTitleCase } from "@/lib/string-utils";

export const GRADUATE_ENTRY_APPLICATION_DEADLINE = gql(/* gql */ `
  fragment GraduateEntryApplicationDeadline on ParagraphGraduateProgramEntryApplicati {
    entryTerm
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

export const GRADUATE_PROGRAM = gql(/* gql */ `
  fragment GraduateProgram on NodeGraduateProgram {
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

export function parseGraduateProgram(program: GraduateProgramFragment | null | undefined) {
  if (!program) {
    return null;
  }

  const duration: GraduateProgram["duration"] = [];
  const deadlines: GraduateProgram["deadlines"] = [];
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
        term: item.entryTerm,
        date: {
          timestamp: isValidDomesticDate ? domesticDate.toISOString() : "",
          showYear: Boolean(item.domesticYear?.name),
        },
        location: "domestic",
        ongoing: item.domesticOngoing ?? false,
        info: item.domesticAppDedInfo ?? undefined,
      });

      deadlines.push({
        term: item.entryTerm,
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

async function getGraduateProgramById(id: string): Promise<GraduateProgram | null> {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GraduateProgramById($id: ID = "", $revision: ID = "") {
        nodeGraduateProgram(id: $id, revision: $revision) {
          ...GraduateProgram
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

  if (!data.nodeGraduateProgram) {
    return null;
  }

  return parseGraduateProgram(data.nodeGraduateProgram);
}

export default getGraduateProgramById;
