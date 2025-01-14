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
  path: path.join(directory, "requirement-section-types.yml"),
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
      acc[key] = z.array(z.string()).nullish();
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
    type: z.enum(Object.keys(degreeTypes)).transform((value) => degreeTypes[value]),
    acronym: z.string(),
    tags: z.array(z.string()),
    requirements: z.array(AdmissionRequirementSchema).nullish(),
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
      .nullish()
      .transform((value) => (value === null ? null : degrees[value])),
    acronym: z.string().nullish(),
    tags: z.array(z.string()),
    requirements: z.array(AdmissionRequirementSchema).nullish(),
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

export async function getUndergraduateStudentTypes() {
  return Object.values(studentTypes);
}

export async function getUndergraduateAdmissionLocations() {
  return Object.values(locations);
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

export async function parseAdmissionRequirementsSlug(slug) {
  return {
    studentType: studentTypes[slug[0]],
    location: locations[slug[1]],
    program: programs[slug[2]] ?? degrees[slug[2]],
  };
}

export async function getUndergraduateRequirements(studentType, location, program) {
  const degreeRequirements = program.degree?.requirements ?? [];
  const programRequirements = program.requirements ?? [];
  const requirements = [...degreeRequirements, ...programRequirements].filter(
    (requirement) =>
      requirement["student-types"].includes(studentType.id) && requirement.locations.includes(location.id)
  );

  const sections = Object.keys(requirementSectionTypes).reduce((acc, section) => {
    acc[section] = {
      title: requirementSectionTypes[section].name,
      type: requirementSectionTypes[section].type,
      content: [],
    };
    return acc;
  }, {});

  for (const requirement of requirements) {
    for (const section in requirement.sections) {
      sections[section].content = requirement.sections[section] ?? [];
    }
  }

  const hasAverage = sections["cut-off"].content.length > 0;

  // If there is an average section in the requirements, add an explanation of cutoff ranges
  if (hasAverage) {
    sections["notes"].content.push(
      "Estimated cutoff ranges are based on admission averages from previous years and are provided as a point of reference. Exact cut-offs are determined by the quantity and quality of applications received and the space available in the program. Having an average within this range does not guarantee admission."
    );
  }

  // If this is a program that offers co-op add to its notes section
  if (program.types?.some((type) => type.id === "co-op")) {
    sections["notes"].content.push(
      hasAverage
        ? "This program is offered with and without co-op. Co-op averages will often exceed the estimated cut-off ranges. Students not admissible to co-op will be automatically considered for the regular program."
        : "This program is offered with and without co-op. Students not admissible to co-op will be automatically considered for the regular program."
    );
  }

  return Object.values(sections);
}
