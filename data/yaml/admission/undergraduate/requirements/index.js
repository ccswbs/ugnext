import studentTypes from './student-types.yml';
import locations from './locations.yml';
import programs from '@/data/yaml/programs/undergraduate.yml';

export const getStudentTypes = async () => {
	return studentTypes;
};

export const getLocations = async () => {
	return locations.reduce((acc, location) => {
		acc[location.type] ??= [];
		acc[location.type].push(location);

		return acc;
	}, {});
};

export const getPrograms = async () => {
	return programs.filter((program) => program.types.includes('major'));
};

export const slugToRequirement = (slug) => {
	return {
		studentType: slug[0],
		program: slug.length !== 1 ? slug[1] : null,
		location: slug.length === 3 ? slug[2] : null,
	};
};

export const isValidRequirement = async (studentType, program, location) => {
	return true;
};

export const getRequirementTitle = async (studentType, program, location) => {
	return '';
};

export const getRequirementContent = async (studentType, program, location) => {
	return '';
};
