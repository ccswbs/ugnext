import { GraduateProgram } from "@/lib/types/graduate-program";
import { gql } from "@/lib/graphql";
import { getClient, handleGraphQLError } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { toTitleCase } from "@uoguelph/react-components";

export const GRADUATE_PROGRAM = gql(/* gql */ `
  fragment GraduateProgram on NodeGraduateProgram {
    __typename
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
    graduateProgramCode
    graduateDelivery
    graduateProgramDegree {
      ...GraduateDegreeType
    }
    graduateProgramType {
      ...GraduateProgramType
    }
    internationalAppDeadline {
      entryTerm
      programEntryDate {
        time
      }
      programOngoing
    }
  }
`);

export async function getGraduateProgramById(id: string): Promise<GraduateProgram | null> {
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
    duration: [],
    deadlines: [],
  };
}
