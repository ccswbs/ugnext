import path from "path";
import {
  getAdmissionLocations,
  getDegrees,
  getDegreeTypes,
  getPrograms,
  getProgramTypes,
  getStudentTypes,
} from "@/data/yaml/programs";
import { parseYamlFiles } from "@/lib/file-utils";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

export async function getUndergraduateStudentTypes() {
  return await getStudentTypes(directory);
}

export async function getUndergraduateDegreeTypes() {
  return await getDegreeTypes(directory);
}

export async function getUndergraduateProgramTypes() {
  const types = await getProgramTypes(directory);
  const degreesTypes = await getDegreeTypes(directory);

  return [...types, ...degreesTypes];
}

export async function getUndergraduateDegrees() {
  return await getDegrees(directory);
}

export async function getUndergraduatePrograms() {
  const programs = await getPrograms(directory);
  const degrees = await getDegrees(directory);

  return [...programs, ...degrees.map((degree) => ({ ...degree, types: [degree.type] }))].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export async function slugToUndergraduateRequirements(slug) {
  const programs = await getPrograms(directory);
  const degrees = await getDegrees(directory);

  const studentType = (await getStudentTypes(directory)).find((studentType) => studentType.id === slug[0]);

  if (!studentType) {
    return null;
  }

  const location = (await getAdmissionLocations()).find((location) => location.id === slug[1]);

  if (!location) {
    return null;
  }

  const program = programs.find((program) => program.id === slug[2]) ?? degrees.find((degree) => degree.id === slug[2]);

  if (!program) {
    return null;
  }

  return { studentType, location, program };
}

const sections = (await parseYamlFiles(path.join(directory, "requirement-sections.yml"))).reduce((acc, section) => {
  acc.set(section.id, section);
  return acc;
}, new Map());

export async function getUndergraduateRequirements(studentType, location, program) {
  const degreeRequirements =
    (await getUndergraduateDegrees())
      .filter((degree) => program?.degrees?.some((programDegree) => programDegree.id === degree.id))
      .map((degree) => degree?.admission?.requirements ?? [])
      .flat() ?? [];

  const programRequirements = program?.admission?.requirements ?? [];

  const requirements = [...degreeRequirements, ...programRequirements].filter((requirement) => {
    const matchesStudentType = requirement.studentType === studentType.id;
    const matchesLocation =
      (Array.isArray(requirement.location) && requirement.location.includes(location.id)) ||
      requirement.location === location.id;

    return matchesStudentType && matchesLocation;
  });

  return Array.from(
    requirements
      .map((requirement) => requirement.content)
      .flat()
      .reduce((acc, section) => {
        acc.set(section.id, { ...section, title: sections.get(section.id)?.title ?? section.id });
        return acc;
      }, new Map())
      .values()
  ).filter((section) => section.content);
}
