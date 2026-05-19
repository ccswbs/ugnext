import { GraduateProgram } from "@/lib/types/graduate-program";
import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { GraduateProgramFragment } from "@/lib/graphql/types";
import { toTitleCase } from "@/lib/string-utils";

export const GRADUATE_PROGRAM = gql(/* gql */ `
  fragment GraduateProgram on NodeGraduateProgram {
    __typename
    graduateProgramCode
    graduateProgramDegree {
      ...GraduateDegreeType
    }
    graduateProgramType {
      ...GraduateProgramType
    }
    graduateDelivery
    admissionAverageLetter
    admissionAverageMaxPerc
    admissionAverageMinPerc
    domesticAppDeadline {
      entryTerm
      programEntryDate {
        time
      }
      programOngoing
    }
    internationalAppDeadline {
      entryTerm
      programEntryDate {
        time
      }
      programOngoing
    }
    durationFullTime {
      durationMinimum
      durationMaximum
      durationType {
        ...GraduateProgramType
      }
    }
    durationPartTime {
      durationMaximum
      durationMinimum
      durationType {
        ...GraduateProgramType
      }
    }
  }
`);

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

  const duration: GraduateProgram["duration"] = [];
  const deadlines: GraduateProgram["deadlines"] = [];
  const parseDuration = (durationData: GraduateProgramFragment["durationFullTime"], durationType: string) => {
    for (const item of durationData ?? []) {
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

  const parseDeadlines = (deadlineData: GraduateProgramFragment["domesticAppDeadline"], deadlineLocation: string) => {
    for (const item of deadlineData ?? []) {
      if (!item.entryTerm) {
        continue;
      }

      deadlines.push({
        term: item.entryTerm,
        date: item.programEntryDate?.time as string,
        location: deadlineLocation,
        ongoing: item.programOngoing ?? false,
      });
    }
  };

  parseDuration(data.nodeGraduateProgram.durationFullTime, "full-time");
  parseDuration(data.nodeGraduateProgram.durationPartTime, "part-time");
  parseDeadlines(data.nodeGraduateProgram.domesticAppDeadline, "domestic");
  parseDeadlines(data.nodeGraduateProgram.internationalAppDeadline, "international");

  return {
    code: data.nodeGraduateProgram.graduateProgramCode ?? "",
    degree: {
      ...data.nodeGraduateProgram.graduateProgramDegree,
      acronym: data.nodeGraduateProgram.graduateProgramDegree.acronym ?? undefined,
    },
    type: data.nodeGraduateProgram.graduateProgramType,
    delivery: data.nodeGraduateProgram.graduateDelivery.map((str) => toTitleCase(str.replace("_", " "))),
    average: {
      letterGrade: data.nodeGraduateProgram.admissionAverageLetter ?? undefined,
      maxPercentage: data.nodeGraduateProgram.admissionAverageMaxPerc ?? undefined,
      minPercentage: data.nodeGraduateProgram.admissionAverageMinPerc ?? undefined,
    },
    duration: duration,
    deadlines: deadlines,
  };
}

export default getGraduateProgramById;
