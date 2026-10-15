import { GraduateProgramDescriptionListFragment } from "../graphql/graphql";

export type GraduateProgramType = {
  id: string;
  name: string;
};

// Yaml uses node + title field
// Drupal uses taxonomy + name field
export type GraduateDegree = {
  __typename: "GraduateDegree";
  id: string;
  name?: string;
  title?: string;
  acronym?: string;
};

export type GraduateProgramDelivery = {
  id: string;
  name: string;
};

export type GraduateProgramDescriptionList = {
  id: string;
  name: string;
  parent: GraduateProgramDescriptionList | null;
};

export type GraduateProgramApplicationDeadline = {
  location: string;
  term: string;
  date?: {
    timestamp: string;
    showYear: boolean;
  };
  ongoing: boolean;
  info?: string;
};

export type GraduateProgramDuration = {
  type: string;
  min: number;
  max?: number;
  programType?: GraduateProgramType;
};

export type GraduateProgramAdmissionAverage = {
  minPercentage?: number;
  maxPercentage?: number;
  letterGrade?: string;
};

export type GraduateProgramRelatedLink = {
  type: "Additional Requirements" | "Program Structure";
  title: string;
  url: string;
  level: "program" | "variant";
};

export type GraduateProgramVariant = {
  code: string;
  degrees: GraduateDegree[];
  type: GraduateProgramType[];
  delivery: GraduateProgramDelivery[];
  descriptionLists: GraduateProgramDescriptionList[];
  average: GraduateProgramAdmissionAverage;
  duration: GraduateProgramDuration[];
  deadlines: GraduateProgramApplicationDeadline[];
  additionalRequirements?: GraduateProgramRelatedLink[];
  programStructure?: GraduateProgramRelatedLink[];
  status: boolean;
};
