import path from "path";
import {
  getAdmissionLocations,
  getDegrees,
  getDegreeTypes,
  getPrograms,
  getProgramTypes,
  getStudentTypes,
} from "@/data/yaml/programs";

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

export async function getUndergraduateRequirements(studentType, location, program) {
  const associatedDegrees = (await getUndergraduateDegrees()).filter((degree) => {
    const hasRequirements = Array.isArray(degree.requirements);
    const isAssociated = program.degrees?.some((d) => d.id === degree.id);

    return hasRequirements && isAssociated;
  });

  const degreeRequirements = associatedDegrees.reduce((acc, degree) => {
    acc.push(...degree.requirements);
    return acc;
  }, []);

  const requirements = [...degreeRequirements, ...(program.requirements ?? [])]
    .filter((requirement) => requirement.studentType === studentType.id && requirement.location.includes(location.id))
    .map((requirement) => `<div class="undergraduate-admission-requirement-fragment">${requirement.content}</div>`)
    .reduce((acc, requirement) => {
      acc += requirement;
      return acc;
    }, "");

  console.log(requirements);

  return {
    title: `${program.name} Admission Requirements for ${studentType.name.replace("Student", "Students").replace("Graduate", "Graduates")} in ${location.name}`,
    content: requirements,
  };
}
