import path from "path";
import { z } from "zod";
import { getYamlData } from "@/lib/file-utils";

const directory = path.join("data", "yaml", "programs", "continuing-education");

export async function getContinuingEducationProgramTypes() {
  return await getYamlData({
    id: "continuing-education-program-types",
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

export async function getContinuingEducationPrograms() {
  const programTypes = await getContinuingEducationProgramTypes();

  return await getYamlData({
    id: "continuing-education-programs",
    path: path.join(directory, "programs", "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      types: z.array(
        z.enum(programTypes.map((type) => type.id)).transform((value) => programTypes.find((type) => type.id === value))
      ),
      tags: z.array(z.string()),
    }),
    postProcessor: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}
