import path from "path";
import { z } from "zod";
import { yamlToMap } from "@/data/yaml/programs";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

const degreeTypes = await yamlToMap({
  path: path.join(directory, "degree-types.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const programTypes = await yamlToMap({
  path: path.join(directory, "program-types.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const degrees = await yamlToMap({
  path: path.join(directory, "degrees", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.enum(Object.keys(degreeTypes)).transform((value) => degreeTypes[value]),
    acronym: z.string(),
    tags: z.array(z.string()),
  }),
});

const programs = await yamlToMap({
  path: path.join(directory, "programs", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    types: z.array(z.enum(Object.keys(programTypes)).transform((value) => programTypes[value])),
    degree: z
      .enum(Object.keys(degrees))
      .nullable()
      .transform((value) => (value === null ? null : degrees[value])),
    acronym: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

export async function getUndergraduateDegreeTypes() {
  return Object.values(degreeTypes);
}

export async function getUndergraduateProgramTypes() {
  const types = Object.values(programTypes);
  const degreeTypes = await getUndergraduateDegreeTypes();

  return [...types, ...degreeTypes];
}

export async function getUndergraduateDegrees() {
  return Object.values(degrees);
}

export async function getUndergraduatePrograms() {
  const undergraduateDegrees = Object.values(degrees).map((degree) => ({
    ...degree,
    types: [degree.type],
  }));

  const undergraduatePrograms = Object.values(programs);

  return [...undergraduatePrograms, ...undergraduateDegrees].sort((a, b) => a.name.localeCompare(b.name));
}
