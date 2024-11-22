import { parseYaml } from "@/lib/file-utils";
import path from "path";

export async function getAdmissionLocations() {
  return await parseYaml(path.join(process.cwd(), "data", "yaml", "programs", "admission-locations.yml"));
}

export async function getStudentTypes(dir) {
  return await parseYaml(path.join(dir, "student-types.yml"));
}

export async function getDegreeTypes(dir) {
  return await parseYaml(path.join(dir, "degree-types.yml"));
}

export async function getProgramTypes(dir) {
  return await parseYaml(path.join(dir, "program-types.yml"));
}

export async function getDegrees(dir) {
  // Parse all the degree YAML files
  const degrees = await parseYaml(path.join(dir, "degrees", "*.yml"));

  // Create a map of the valid degree types
  const types = (await getDegreeTypes(dir)).reduce((acc, type) => {
    acc.set(type.id, type);
    return acc;
  }, new Map());

  // Resolve the references to degree types in each degree
  return degrees.map((degree) => {
    console.log(degree);
    
    if (!types.has(degree.type)) {
      throw new Error(`Degree '${degree.id}' has a invalid degree type '${degree.type}'`);
    }

    return {
      ...degree,
      type: types.get(degree.type),
    };
  });
}

export async function getPrograms(dir) {
  // Get all the program YAML files
  const programs = await parseYaml(path.join(dir, "programs", "*.yml"));

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
  return programs.map((program) => {
    const programTypes = program.types.map((type) => {
      if (!types.has(type)) {
        throw new Error(`Program '${program.id}' has an invalid program type '${type}'`);
      }

      return types.get(type);
    });

    const programDegrees = program.degrees?.map((degree) => {
      if (!degrees.has(degree)) {
        throw new Error(`Program '${program.id}' has an invalid degree '${degree}'`);
      }

      const resolvedDegree = degrees.get(degree);

      // Only keep some information from the degree in the program
      return {
        id: resolvedDegree.id,
        name: resolvedDegree.name,
        type: resolvedDegree.type,
      };
    });

    return {
      ...program,
      types: programTypes,
      degrees: programDegrees ?? null,
    };
  });
}