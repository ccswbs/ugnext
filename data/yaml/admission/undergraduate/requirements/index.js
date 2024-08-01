import canada from './canada.yml';
import international from './international.yml';
import studentTypes from './student-types.yml';
import allPrograms from '@/data/yaml/programs/undergraduate.yml';

const programs = allPrograms?.filter((program) => program?.types?.includes('major'));

const degrees = Array.from(
	programs.reduce((acc, program, index) => {
		for (const degree of program.degrees) {
			acc.add(degree);
		}

		return acc;
	}, new Set()),
);

export const getStudentTypes = () => {
	return studentTypes;
};

export const getLocations = () => {
	return {
		canada: canada,
		international: international
	};
};

export const getPrograms = () => {
	return programs;
};

export const getDegrees = () => {
	return degrees;
};
