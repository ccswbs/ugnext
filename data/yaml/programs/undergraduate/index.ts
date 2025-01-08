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

export type UndergraduateStudentType = {
  id: string;
  name: string;
};

const studentTypes: Map<string, UndergraduateStudentType> = (
  await parseYamlFiles(path.join(directory, "student-types.yml"))
).reduce((acc: Map<string, UndergraduateStudentType>, type: any) => {
  if (!("id" in type) || typeof type.id !== "string") {
    throw new TypeError(`In ${directory}/student-types.yml: Student type must have a string id`);
  }

  if (!("name" in type) || typeof type.name !== "string") {
    throw new TypeError(`In ${directory}/student-types.yml: Student type must have a string name`);
  }

  return acc.set(type.id, type);
}, new Map<string, UndergraduateStudentType>());

export type UndergraduateAdmissionLocation = {
  id: string;
  name: string;
  type: "domestic" | "international" | "curriculum";
};

export type UndergraduateDegreeType = {
  id: string;
  name: string;
};

export type UndergraduateProgramType = {
  id: string;
  name: string;
};

export type UndergraduateAdmissionRequirementSection = {
  id: string;
  name: string;
  type: "list" | "text";
  content?: string | string[];
};

export type UndergraduateAdmissionRequirement = {
  studentType: UndergraduateStudentType | UndergraduateStudentType[];
  location: UndergraduateAdmissionLocation | UndergraduateAdmissionLocation[];
  sections: UndergraduateAdmissionRequirementSection[];
};

export type UndergraduateDegree = {
  id: string;
  name: string;
  url: string;
  type: UndergraduateDegreeType;
  acronym: string;
  tags: string[];
  admission?: {
    requirements?: UndergraduateAdmissionRequirement[];
  };
};

export type UndergraduateProgram = {
  id: string;
  name: string;
  url: string;
  types: UndergraduateProgramType[];
  acronym: string;
  degree: UndergraduateDegree;
  tags: string[];
  admission?: {
    alternative?: UndergraduateProgram[];
    requirements?: UndergraduateAdmissionRequirement[];
  };
};

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

export async function getUndergraduateDegree(id) {
  try {
    return await getDegrees(path.join(directory, "degrees", `${id}.yml`));
  } catch (e) {
    return null;
  }
}

export async function getUndergraduateProgram(id) {
  try {
    return await getPrograms(path.join(directory, "programs", `${id}.yml`));
  } catch (e) {
    return null;
  }
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

const sections = await parseYamlFiles(path.join(directory, "requirement-sections-types.yml"));

export async function getUndergraduateRequirements(studentType, location, program) {
  const programDegrees = await Promise.all(
    program.degrees.map(async (degree) => await getUndergraduateDegree(degree.id))
  );

  console.log(await getUndergraduateDegree("bachelor-applied-science"));

  const programRequirements = program?.admission?.requirements ?? [];

  const filteredRequirements = [...programRequirements].filter((requirement) => {
    const matchesStudentType = requirement.studentType === studentType.id;
    const matchesLocation =
      (Array.isArray(requirement.location) && requirement.location.includes(location.id)) ||
      requirement.location === location.id;

    return matchesStudentType && matchesLocation;
  });

  const requirements = sections.reduce((acc, section) => {
    acc[section.id] = { ...section, content: [] };
    return acc;
  }, {});

  filteredRequirements
    .map((requirement) => requirement.content)
    .flat()
    .forEach((section) => {
      if (Array.isArray(section.content)) {
        requirements[section.id].content = section.content;
      } else if (section.content) {
        requirements[section.id].content = [section.content];
      } else {
        requirements[section.id].content = [];
      }
    });

  const hasAverage = requirements["average"].content.length > 0;

  // If there is an average section in the requirements, add an explanation of cutoff ranges
  if (hasAverage) {
    requirements["notes"].content.push(
      "Estimated cutoff ranges are based on admission averages from previous years and are provided as a point of reference. Exact cut-offs are determined by the quantity and quality of applications received and the space available in the program. Having an average within this range does not guarantee admission."
    );
  }

  // If this is a program that offers co-op add to its notes section
  if (program.types.some((type) => type.id === "co-op")) {
    requirements["notes"].content.push(
      hasAverage
        ? "This program is offered with and without co-op. Co-op averages will often exceed the estimated cut-off ranges. Students not admissible to co-op will be automatically considered for the regular program."
        : "This program is offered with and without co-op. Students not admissible to co-op will be automatically considered for the regular program."
    );
  }

  return Object.values(requirements);
}
