import path from "path";
import { z } from "zod";
import { getYamlData } from "@/lib/file-utils";
import { UndergraduateAdmissionLocation } from "@/data/drupal/undergraduate-admission-requirements";
import { slugify } from "@/lib/string-utils";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

export async function getUndergraduateDegreeTypes() {
  return (await getYamlData({
    id: "undergraduate-degree-types",
    path: path.join(directory, "degree-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  })) as { id: string; name: string }[];
}

export async function getUndergraduateProgramTypes() {
  return (await getYamlData({
    id: "undergraduate-program-types",
    path: path.join(directory, "program-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  })) as { id: string; name: string }[];
}

export async function getUndergraduateStudentTypes() {
  return await getYamlData({
    id: "undergraduate-student-types",
    path: path.join(directory, "student-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateAdmissionLocations() {
  const data = await getYamlData({
    id: "undergraduate-admission-locations",
    path: path.join(directory, "locations.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["domestic", "international", "curriculum"]),
      })
    ),
    postProcessor: (data) =>
      data.flat().map((item) => {
        return {
          __typename: "TermAdmissionLocation",
          ...item,
        } as UndergraduateAdmissionLocation;
      }),
  });

  return data as UndergraduateAdmissionLocation[];
}

export async function getUndergraduateAdmissionRequirementSectionTypes() {
  return await getYamlData({
    id: "undergraduate-admission-requirement-section-types",
    path: path.join(directory, "admission-requirement-section-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["text", "list"]),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}
export async function getUndergraduateDegrees() {
  const degreeTypes = await getUndergraduateDegreeTypes();

  return await getYamlData({
    id: "undergraduate-degrees",
    path: path.join(directory, "degrees", "*.yml"),
    listen: path.join(directory, "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      type: z
        .enum(degreeTypes.map((type) => type.id))
        .transform((value) => degreeTypes.find((type) => type.id === value)),
      acronym: z.string(),
      tags: z.array(z.string()),
    }),
    postProcessor: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}

export async function getUndergraduatePrograms() {
  const programTypes = await getUndergraduateProgramTypes();
  const degrees = await getUndergraduateDegrees();

  return await getYamlData({
    id: "undergraduate-programs",
    path: path.join(directory, "programs", "*.yml"),
    listen: `{${path.join(directory, "degrees", "**", "*.yml")},${path.join(directory, "*.yml")}}`,
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      types: z.array(
        z.enum(programTypes.map((type) => type.id)).transform((value) => programTypes.find((type) => type.id === value))
      ),
      degree: z
        .enum(degrees.map((degree) => degree.id))
        .nullish()
        .transform((value) => degrees.find((degree) => degree.id === value) ?? null),
      acronym: z.string().optional(),
      tags: z.array(z.string()),
    }),
    postProcessor: (data) => {
      return data.sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}
