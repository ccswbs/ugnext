import { parseYamlFiles } from "../../../lib/file-utils";
import path from "path";

export async function yamlToMap(path, schema) {
  const parsedFiles = await parseYamlFiles(path);

  return parsedFiles.reduce((acc, { path, content }) => {
    const parsed = schema.safeParse(content);

    if (!parsed.success) {
      throw new Error(`Failed to parse yaml file ${path}: ${parsed.error.toString()}`);
    }

    acc[content.id] = parsed.data;
    return acc;
  }, {});
}

export async function getAdmissionLocations(dir) {
  return await parseYamlFiles(path.join(dir, "admission-locations.yml"));
}

export async function getStudentTypes(dir) {
  return await parseYamlFiles(path.join(dir, "student-types.yml"));
}

export async function getDegreeTypes(dir) {
  return await parseYamlFiles(path.join(dir, "degree-types.yml"));
}

export async function getProgramTypes(dir) {
  return await parseYamlFiles(path.join(dir, "program-types.yml"));
}

export async function getDegrees(dir) {
  // Parse all the degree YAML files
  const degrees = await parseYamlFiles(path.join(dir, "degrees", "*.yml"));

  // Create a map of the valid degree types
  const types = (await getDegreeTypes(dir)).reduce((acc, type) => {
    acc.set(type.id, type);
    return acc;
  }, new Map());

  // Resolve the references to degree types in each degree
  return degrees
    .map((degree) => {
      if (!types.has(degree.type)) {
        throw new Error(`Degree '${degree.id}' has a invalid degree type '${degree.type}'`);
      }

      return {
        ...degree,
        type: types.get(degree.type),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPrograms(dir) {
  // Get all the program YAML files
  const programs = await parseYamlFiles(path.join(dir, "programs", "*.yml"));

  // Create a map of the valid program types
  const types = (await getProgramTypes(dir)).reduce((acc, type) => {
    acc.set(type.id, type);
    return acc;
  }, new Map());

  // Create a map of all the valid degrees
  const degrees = (await getDegrees(dir)).reduce((acc, degree) => {
    acc.set(degree.id, degree);
    return acc;
  }, new Map());

  // Resolve the references to program types and degrees (if the program has them) in each program
  return programs
    .map((program) => {
      const programTypes = program.types
        .map((type) => {
          if (!types.has(type)) {
            throw new Error(`Program '${program.id}' has an invalid program type '${type}'`);
          }

          return types.get(type);
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      const programDegrees = program.degrees
        ?.map((degree) => {
          if (!degrees.has(degree)) {
            throw new Error(`Program '${program.id}' has an invalid degree '${degree}'`);
          }

          const resolvedDegree = degrees.get(degree);

          // Only keep some information from the degree in the program
          return {
            id: resolvedDegree.id,
            name: resolvedDegree.name,
            type: resolvedDegree.type,
            acronym: resolvedDegree.acronym,
          };
        })
        ?.sort((a, b) => a.name.localeCompare(b.name));

      return {
        ...program,
        types: programTypes,
        degrees: programDegrees ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
