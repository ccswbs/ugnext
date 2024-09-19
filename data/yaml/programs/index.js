import undergraduate from "./undergraduate.yml";
import degrees from "./undergraduate-degrees.yml";
import graduate from "./graduate.yml";
import certificateAndDiplomas from "./certificate-and-diploma.yml";
import continuingEducation from "./continuing-education.yml";

export const getUndergraduatePrograms = async () => {
  return undergraduate;
};

export const getGraduatePrograms = async () => {
  return graduate;
};

export const getCertificateAndDiplomaPrograms = async () => {
  return certificateAndDiplomas;
};

export const getContinuingEducationPrograms = async () => {
  return continuingEducation;
};

export const getUndergraduateDegrees = async () => {
  return degrees.map((degree) => ({
    ...degree,
    types: ["bachelor"],
    tags: [],
    url: `https://uoguelph.ca${degree.url}`,
  }));
};
