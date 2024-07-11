import undergraduate from './undergraduate.yml';
import graduate from './graduate.yml';
import certificateAndDiplomas from './certificate-and-diploma.yml';
import continuingEducation from './continuing-education.yml';

export const getUndergraduatePrograms = () => {
	return undergraduate;
};

export const getGraduatePrograms = () => {
	return graduate;
};

export const getCertificateAndDiplomaPrograms = () => {
	return certificateAndDiplomas;
};

export const getContinuingEducationPrograms = () => {
	return continuingEducation;
};
