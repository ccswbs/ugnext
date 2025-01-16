import path from "path";
import { getYamlData } from "@/lib/file-utils";
import { z } from "zod";

const directory = path.join("data", "yaml", "programs", "certificate-and-diploma");

export async function getCertificateAndDiplomaProgramTypes() {
  return await getYamlData({
    id: "certificate-and-diploma-program-types",
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

export async function getCertificateAndDiplomaPrograms() {
  const programTypes = await getCertificateAndDiplomaProgramTypes();

  return await getYamlData({
    id: "certificate-and-diploma-programs",
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
