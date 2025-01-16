import path from "path";
import { z } from "zod";
import { getYamlData } from "@/lib/file-utils";

const directory = path.join("data", "yaml", "programs", "graduate");

export async function getGraduateDegreeTypes() {
  return await getYamlData({
    id: "graduate-degree-types",
    path: path.join(directory, "degree-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getGraduateProgramTypes() {
  return await getYamlData({
    id: "graduate-program-types",
    path: path.join(directory, "program-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getGraduateDegrees() {
  const degreeTypes = await getGraduateDegreeTypes();

  return await getYamlData({
    id: "graduate-degrees",
    path: path.join(directory, "degrees", "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      type: z
        .enum(degreeTypes.map((type) => type.id))
        .transform((degreeType) => degreeTypes.find((type) => type.id === degreeType)),
      acronym: z.string(),
    }),
  });
}

export async function getGraduatePrograms() {
  const programTypes = await getGraduateProgramTypes();
  const degrees = await getGraduateDegrees();

  return await getYamlData({
    id: "graduate-programs",
    path: path.join(directory, "programs", "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      types: z.array(
        z.enum(programTypes.map((type) => type.id)).transform((value) => programTypes.find((type) => type.id === value))
      ),
      degrees: z.array(
        z.enum(degrees.map((degree) => degree.id)).transform((value) => degrees.find((degree) => degree.id === value))
      ),
      acronym: z.string().optional(),
      tags: z.array(z.string()),
    }),
    postProcessor: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}
