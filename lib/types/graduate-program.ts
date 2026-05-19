export type GraduateProgramType = {
  id: string;
  name: string;
};

export type GraduateDegree = {
  id: string;
  name: string;
  acronym?: string;
};

export type GraduateProgramApplicationDeadline = {
  location: "domestic" | "international";
  term: "fall" | "winter" | "spring";
  date: string;
  showYear?: boolean;
};

export type GraduateProgramDuration = {
  type: "full-time" | "part-time";
  min: number;
  max?: number;
  programType?: string;
};

export type GraduateProgramAdmissionAverage = {
  minPercentage?: number;
  maxPercentage?: number;
  letterGrade?: string;
};

export type GraduateProgram = {
  code: string;
  degree: GraduateDegree;
  type: GraduateProgramType[];
  delivery: string[];
  average: GraduateProgramAdmissionAverage;
  duration: GraduateProgramDuration[];
  deadlines: GraduateProgramApplicationDeadline[];
};
