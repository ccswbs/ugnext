export type GraduateProgramApplicationDeadline = {
  location: "domestic" | "international";
  term: "fall" | "winter" | "spring";
  date: Date;
};

export type GraduateProgramDuration = {
  type: "full-time" | "part-time";
  min: number;
  max?: number;
  programType: string;
};

export type GraduateProgramAdmissionAverage = {
  details: string;
  percentage?: {
    min: number;
    max?: number;
  };
  letterGrade?: string;
};

export type GraduateDegree = {
  id: string;
  name: string;
  acronym?: string;
};

export type GraduateProgram = {
  code: string;
  degree: GraduateDegree[];
  type: string[];
  delivery: string[];
  average: GraduateProgramAdmissionAverage;
  duration: GraduateProgramDuration[];
  deadlines: GraduateProgramApplicationDeadline[];
};
