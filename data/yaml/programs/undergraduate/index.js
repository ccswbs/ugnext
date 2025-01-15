import path from "path";
import { z } from "zod";
import { getYamlData } from "@/lib/file-utils";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

export async function getUndergraduateDegreeTypes() {
  return await getYamlData({
    id: "undergraduate-degree-types",
    path: path.join(directory, "degree-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateProgramTypes() {
  return await getYamlData({
    id: "undergraduate-program-types",
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

export async function getUndergraduateStudentTypes() {
  return await getYamlData({
    id: "undergraduate-student-types",
    path: path.join(directory, "student-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateAdmissionLocations() {
  return await getYamlData({
    id: "undergraduate-admission-locations",
    path: path.join(directory, "locations.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["domestic", "international", "curriculum"]),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateAdmissionRequirementSectionTypes() {
  return await getYamlData({
    id: "undergraduate-admission-requirement-section-types",
    path: path.join(directory, "admission-requirement-section-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["text", "list"]),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

async function getAdmissionRequirementsSchema() {
  const studentTypes = await getUndergraduateStudentTypes();
  const locations = await getUndergraduateAdmissionLocations();
  const admissionRequirementSectionTypes = await getUndergraduateAdmissionRequirementSectionTypes();

  return z
    .array(
      z.object({
        "student-types": z.array(
          z
            .enum(studentTypes.map((type) => type.id))
            .transform((value) => studentTypes.find((type) => type.id === value))
        ),
        locations: z.array(
          z
            .enum(locations.map((location) => location.id))
            .transform((value) => locations.find((location) => location.id === value))
        ),
        sections: z.object(
          admissionRequirementSectionTypes.reduce((acc, type) => {
            acc[type.id] = z.array(z.string()).nullish();
            return acc;
          }, {})
        ),
      })
    )
    .nullish();
}

export async function getUndergraduateDegrees() {
  const degreeTypes = await getUndergraduateDegreeTypes();

  return await getYamlData({
    id: "undergraduate-degrees",
    path: path.join(directory, "degrees", "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      type: z
        .enum(degreeTypes.map((type) => type.id))
        .transform((value) => degreeTypes.find((type) => type.id === value)),
      acronym: z.string(),
      tags: z.array(z.string()),
      requirements: await getAdmissionRequirementsSchema(),
    }),
    postProcessor: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}

export async function getUndergraduatePrograms() {
  const programTypes = await getUndergraduateProgramTypes();
  const degrees = await getUndergraduateDegrees();

  return await getYamlData({
    id: "undergraduate-programs",
    path: path.join(directory, "programs", "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      types: z.array(
        z.enum(programTypes.map((type) => type.id)).transform((value) => programTypes.find((type) => type.id === value))
      ),
      degree: z
        .enum(degrees.map((degree) => degree.id))
        .nullish()
        .transform((value) => degrees.find((degree) => degree.id === value) ?? null),
      acronym: z.string().optional(),
      tags: z.array(z.string()),
      requirements: await getAdmissionRequirementsSchema(),
    }),
    postProcessor: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}

export async function parseAdmissionRequirementsSlug(slug) {
  const studentTypes = await getUndergraduateStudentTypes();
  const studentType = studentTypes.find((type) => type.id === slug[0]);

  if (!studentType) {
    return {
      studentType: null,
      location: null,
      program: null,
    };
  }

  const locations = await getUndergraduateAdmissionLocations();
  const location = locations.find((location) => location.id === slug[1]);

  if (!location) {
    return {
      studentType: studentType,
      location: null,
      program: null,
    };
  }

  const programs = await getUndergraduatePrograms();
  let program = programs.find((program) => program.id === slug[2]);

  if (!program) {
    const degrees = await getUndergraduateDegrees();
    program = degrees.find((degree) => degree.id === slug[2]) ?? null;
  }

  return {
    studentType: studentType,
    location: location,
    program: program,
  };
}

export async function getUndergraduateRequirements(studentType, location, program) {
  const degreeRequirements = program.degree?.requirements ?? [];
  const programRequirements = program.requirements ?? [];
  const requirements = [...degreeRequirements, ...programRequirements].filter((requirement) => {
    const matchesStudentType = requirement["student-types"].find((type) => type.id === studentType.id);
    const matchesLocation = requirement.locations.find((location) => location.id === location.id);

    return matchesStudentType && matchesLocation;
  });

  const admissionRequirementSectionTypes = await getUndergraduateAdmissionRequirementSectionTypes();

  const sections = admissionRequirementSectionTypes.reduce((acc, section) => {
    acc[section.id] = {
      ...section,
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

  // If this program has aleternative offers, then we mention it in the notes section
  if (program["alternative-offers"]?.length > 0) {
    sections["notes"].content.push(
      `Students not admissible to this program will automatically be considered for ${program["alternative-offers"].map((program) => `<a href="${program.url}">${program.name}</a>`).join(", ")}. Learn more about <a href="https://www.uoguelph.ca/admission/undergraduate/apply/alternate">Alternate Offers</a>.`
    );
  }

  if (program["fully-online"]) {
    sections["notes"].content.push(
      "This program is pending Senate approval and is offered fully online. Students enrolled in the online program cannot take in-person courses."
    );
  }

  return Object.values(sections);
}
