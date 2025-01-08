import path from "path";
import { parseYamlFiles } from "../../../../lib/file-utils";
import { z } from "zod";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

const studentTypes = {
  "high-school": { id: "high-school", name: "High School Student/Graduate" },
  university: { id: "university", name: "University Student/Graduate" },
  college: { id: "college", name: "College Student/Graduate" },
  internal: { id: "internal", name: "Current or Previous University of Guelph Student" },
};

const degreeTypes = {
  bachelor: { id: "bachelor", name: "Bachelor" },
  dvm: { id: "dvm", name: "Doctor of Veterinary Medicine Degree" },
};

const programTypes = {
  major: { id: "major", name: "Major" },
  minor: { id: "minor", name: "Minor" },
  "co-op": { id: "co-op", name: "Co-op" },
  "area-of-concentration": { id: "area-of-concentration", name: "Area of Concentration" },
};

const admissionRequirementSectionTypes = {
  "cut-off": { id: "cut-off", title: "Estimated Cut-off Range", type: "text" },
  "required-courses": { id: "required-courses", title: "Required Courses", type: "list" },
  "recommended-courses": { id: "recommended-courses", title: "Recommended Courses", type: "list" },
  "general-requirements": { id: "general-requirements", title: "General Requirements", type: "list" },
  "program-requirements": { id: "program-requirements", title: "Program Requirements", type: "list" },
  "additional-info": { id: "additional-info", title: "Additional Information", type: "list" },
};

const admissionLocations = {
  ontario: { id: "ontario", name: "Ontario", type: "domestic" },
  alberta: { id: "alberta", name: "Alberta", type: "domestic" },
  "british-columbia": { id: "british-columbia", name: "British Columbia", type: "domestic" },
  manitoba: { id: "manitoba", name: "Manitoba", type: "domestic" },
  "new-brunswick": { id: "new-brunswick", name: "New Brunswick", type: "domestic" },
  "newfoundland-and-labrador": { id: "newfoundland-and-labrador", name: "Newfoundland and Labrador", type: "domestic" },
  "nova-scotia": { id: "nova-scotia", name: "Nova Scotia", type: "domestic" },
  "prince-edward-island": { id: "prince-edward-island", name: "Prince Edward Island", type: "domestic" },
  quebec: { id: "quebec", name: "Quebec", type: "domestic" },
  saskatchewan: { id: "saskatchewan", name: "Saskatchewan", type: "domestic" },
  afghanistan: { id: "afghanistan", name: "Afghanistan", type: "international" },
  argentina: { id: "argentina", name: "Argentina", type: "international" },
  austria: { id: "austria", name: "Austria", type: "international" },
  azerbaijan: { id: "azerbaijan", name: "Azerbaijan", type: "international" },
  bahrain: { id: "bahrain", name: "Bahrain", type: "international" },
  bahamas: { id: "bahamas", name: "Bahamas", type: "international" },
  bangladesh: { id: "bangladesh", name: "Bangladesh", type: "international" },
  barbados: { id: "barbados", name: "Barbados", type: "international" },
  bermuda: { id: "bermuda", name: "Bermuda", type: "international" },
  bolivia: { id: "bolivia", name: "Bolivia", type: "international" },
  botswana: { id: "botswana", name: "Botswana", type: "international" },
  brazil: { id: "brazil", name: "Brazil", type: "international" },
  cameroon: { id: "cameroon", name: "Cameroon", type: "international" },
  caribbean: { id: "caribbean", name: "Caribbean", type: "international" },
  chile: { id: "chile", name: "Chile", type: "international" },
  china: { id: "china", name: "China", type: "international" },
  colombia: { id: "colombia", name: "Colombia", type: "international" },
  "costa-rica": { id: "costa-rica", name: "Costa Rica", type: "international" },
  "dominican-republic": { id: "dominican-republic", name: "Dominican Republic", type: "international" },
  ecuador: { id: "ecuador", name: "Ecuador", type: "international" },
  egypt: { id: "egypt", name: "Egypt", type: "international" },
  "el-savador": { id: "el-savador", name: "El Savador", type: "international" },
  ethiopia: { id: "ethiopia", name: "Ethiopia", type: "international" },
  france: { id: "france", name: "France", type: "international" },
  germany: { id: "germany", name: "Germany", type: "international" },
  ghana: { id: "ghana", name: "Ghana", type: "international" },
  greece: { id: "greece", name: "Greece", type: "international" },
  guatemala: { id: "guatemala", name: "Guatemala", type: "international" },
  "hong-kong": { id: "hong-kong", name: "Hong Kong", type: "international" },
  haiti: { id: "haiti", name: "Haiti", type: "international" },
  india: { id: "india", name: "India", type: "international" },
  indonesia: { id: "indonesia", name: "Indonesia", type: "international" },
  iran: { id: "iran", name: "Iran", type: "international" },
  iraq: { id: "iraq", name: "Iraq", type: "international" },
  ireland: { id: "ireland", name: "Ireland", type: "international" },
  italy: { id: "italy", name: "Italy", type: "international" },
  japan: { id: "japan", name: "Japan", type: "international" },
  jamaica: { id: "jamaica", name: "Jamaica", type: "international" },
  jordan: { id: "jordan", name: "Jordan", type: "international" },
  kazakhstan: { id: "kazakhstan", name: "Kazakhstan", type: "international" },
  kenya: { id: "kenya", name: "Kenya", type: "international" },
  kuwait: { id: "kuwait", name: "Kuwait", type: "international" },
  latvia: { id: "latvia", name: "Latvia", type: "international" },
  lebanon: { id: "lebanon", name: "Lebanon", type: "international" },
  libya: { id: "libya", name: "Libya", type: "international" },
  malaysia: { id: "malaysia", name: "Malaysia", type: "international" },
  mauritius: { id: "mauritius", name: "Mauritius", type: "international" },
  mexico: { id: "mexico", name: "Mexico", type: "international" },
  "middle-east": { id: "middle-east", name: "Middle East", type: "international" },
  netherlands: { id: "netherlands", name: "Netherlands", type: "international" },
  "new-zealand": { id: "new-zealand", name: "New Zealand", type: "international" },
  nigeria: { id: "nigeria", name: "Nigeria", type: "international" },
  norway: { id: "norway", name: "Norway", type: "international" },
  oman: { id: "oman", name: "Oman", type: "international" },
  pakistan: { id: "pakistan", name: "Pakistan", type: "international" },
  palestine: { id: "palestine", name: "Palestine", type: "international" },
  panama: { id: "panama", name: "Panama", type: "international" },
  peru: { id: "peru", name: "Peru", type: "international" },
  philippines: { id: "philippines", name: "Philippines", type: "international" },
  poland: { id: "poland", name: "Poland", type: "international" },
  portugal: { id: "portugal", name: "Portugal", type: "international" },
  qatar: { id: "qatar", name: "Qatar", type: "international" },
  russia: { id: "russia", name: "Russia", type: "international" },
  "saudia-arabia": { id: "saudia-arabia", name: "Saudia Arabia", type: "international" },
  singapore: { id: "singapore", name: "Singapore", type: "international" },
  "south-africa": { id: "south-africa", name: "South Africa", type: "international" },
  "south-korea": { id: "south-korea", name: "South Korea", type: "international" },
  "sri-lanka": { id: "sri-lanka", name: "Sri Lanka", type: "international" },
  sweden: { id: "sweden", name: "Sweden", type: "international" },
  switzerland: { id: "switzerland", name: "Switzerland", type: "international" },
  syria: { id: "syria", name: "Syria", type: "international" },
  taiwan: { id: "taiwan", name: "Taiwan", type: "international" },
  tanzania: { id: "tanzania", name: "Tanzania", type: "international" },
  thailand: { id: "thailand", name: "Thailand", type: "international" },
  trinidad: { id: "trinidad", name: "Trinidad", type: "international" },
  turkey: { id: "turkey", name: "Turkey", type: "international" },
  uae: { id: "uae", name: "UAE", type: "international" },
  uganda: { id: "uganda", name: "Uganda", type: "international" },
  ukraine: { id: "ukraine", name: "Ukraine", type: "international" },
  "united-states-of-america": {
    id: "united-states-of-america",
    name: "United States of America",
    type: "international",
  },
  "united-kingdom": { id: "united-kingdom", name: "United Kingdom", type: "international" },
  uzbekistan: { id: "uzbekistan", name: "Uzbekistan", type: "international" },
  venezuela: { id: "venezuela", name: "Venezuela", type: "international" },
  vietnam: { id: "vietnam", name: "Vietnam", type: "international" },
  yemen: { id: "yemen", name: "Yemen", type: "international" },
  zambia: { id: "zambia", name: "Zambia", type: "international" },
  zimbabwe: { id: "zimbabwe", name: "Zimbabwe", type: "international" },
  "advanced-placement": { id: "advanced-placement", name: "Advanced Placement", type: "curriculum" },
  "american-curriculum": { id: "american-curriculum", name: "American Curriculum", type: "curriculum" },
  "chinese-curriculum": { id: "chinese-curriculum", name: "Chinese Curriculum", type: "curriculum" },
  "european-baccalaureate": { id: "european-baccalaureate", name: "European Baccalaureate", type: "curriculum" },
  "french-baccalaureate": { id: "french-baccalaureate", name: "French Baccalaureate", type: "curriculum" },
  "international-baccalaureate": {
    id: "international-baccalaureate",
    name: "International Baccalaureate",
    type: "curriculum",
  },
  "british-patterned-education-gce": {
    id: "british-patterned-education-gce",
    name: "British Patterned Education (GCE)",
    type: "curriculum",
  },
};

const AdmissionRequirement = z.object({
  "student-types": z.array(z.enum(Object.keys(studentTypes))),
  locations: z.array(z.enum(Object.keys(admissionLocations))),
  sections: z.object(
    Object.keys(admissionRequirementSectionTypes).reduce((acc, key) => {
      acc[key] = z.optional(z.union([z.array(z.string()), z.string()]));
      return acc;
    }, {})
  ),
});

const Degree = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.enum(Object.keys(degreeTypes)),
  acronym: z.string(),
  tags: z.array(z.string()),
  requirements: z.array(AdmissionRequirement),
});

const degrees = (await parseYamlFiles(path.join(directory, "degrees", "*.yml"))).reduce(
  (acc, { path, content: degree }) => {
    const parsed = Degree.safeParse(degree);

    if (!parsed.success) {
      throw new Error(`Failed to parse degree yaml file ${path}: ${parsed.error.toString()}`);
    }

    acc[degree.id] = parsed.data;
    return acc;
  },
  {}
);

const Program = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  types: z.array(z.enum(Object.keys(programTypes))),
  degree: z.array(z.enum(Object.keys(degrees))),
  acronym: z.string(),
  tags: z.array(z.string()),
  requirements: z.array(AdmissionRequirement),
});

const programs = (await parseYamlFiles(path.join(directory, "programs", "*.yml"))).reduce(
  (acc, { path, content: program }) => {
    const parsed = Program.safeParse(program);

    if (!parsed.success) {
      throw new Error(`Failed to parse program yaml file ${path}: ${parsed.error.message}`);
    }

    acc[program.id] = parsed.data;
    return acc;
  },
  {}
);

programs;

/*
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
*/
