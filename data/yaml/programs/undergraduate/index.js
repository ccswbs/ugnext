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

const studentTypes = await yamlToMap({
  path: path.join(directory, "student-types.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const locations = await yamlToMap({
  path: path.join(directory, "locations.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["domestic", "international", "curriculum"]),
    })
  ),
});

const requirementSectionTypes = await yamlToMap({
  path: path.join(directory, "locations.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["text", "list"]),
    })
  ),
});

const AdmissionRequirementSchema = z.object({
  "student-types": z.array(z.enum(Object.keys(studentTypes))),
  locations: z.array(z.enum(Object.keys(locations))),
  sections: z.object(
    Object.keys(requirementSectionTypes).reduce((acc, key) => {
      acc[key] = z.optional(z.union([z.array(z.string()), z.string()]));
      return acc;
    }, {})
  ),
});

const degrees = await yamlToMap({
  path: path.join(directory, "degrees", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.enum(Object.keys(degreeTypes)),
    acronym: z.string(),
    tags: z.array(z.string()),
    requirements: z.array(AdmissionRequirementSchema).isOptional(),
  }),
  parser: (degree) => ({
    ...degree,
    type: degreeTypes[degree.type],
  }),
});

const programs = await yamlToMap({
  path: path.join(directory, "programs", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    types: z.array(z.enum(Object.keys(programTypes))),
    degrees: z.array(z.enum(Object.keys(degrees))),
    acronym: z.string().optional(),
    tags: z.array(z.string()),
    requirements: z.array(AdmissionRequirementSchema).isOptional(),
  }),
  parser: (program) => ({
    ...program,
    types: program.types.map((type) => programTypes[type]),
    degrees: program.degrees.map((degree) => degrees[degree]),
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

/*
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
*/