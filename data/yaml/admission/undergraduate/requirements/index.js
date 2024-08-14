import studentTypes from './student-types.yml';
import locations from './locations.yml';
import allPrograms from '@/data/yaml/programs/undergraduate.yml';

const programs = allPrograms.filter((program) => program.types.includes('major'));

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
	return programs;
};

export const slugToRequirement = (slug) => {
	return {
		studentType: slug[0],
		program: slug.length !== 1 ? slug[1] : null,
		location: slug.length === 3 ? slug[2] : null,
	};
};

export const isValidRequirement = async (studentTypeID, programID, locationID) => {
	const studentType = studentTypes.find(({ id }) => id === studentTypeID);

	// Check if there exists a student type with the id (retrieved from the slug) in the list
	if (!studentType) {
		return false;
	}

	// if the student type is location independent, then the slug shouldn't contain a program id
	if (!studentType.program_dependent && programID) {
		return false;
	}

	// if the student type is location independent, then the slug shouldn't contain a location id
	if (!studentType.location_dependent && locationID) {
		return false;
	}

	if (studentType.program_dependent && !programs.some(({ id }) => id === programID)) {
		return false;
	}

	if (studentType.location_dependent && !locations.some(({ id }) => id === locationID)) {
		return false;
	}

	return true;
};

export const getRequirementTitle = async (studentTypeID, programID, locationID) => {
	const studentTypeName = studentTypes
		.find(({ id, name }) => id === studentTypeID)
		?.name?.replace('Student', 'Students')
		?.replace('Graduate', 'Graduates');

	if (!programID && !locationID) {
		return `Undergraduate Admission Requirements for ${studentTypeName}`;
	}

	const programName = programs.find(({ id, name }) => id === programID)?.name;
	const locationName = locations.find(({ id, name }) => id === locationID)?.name;

	if (programName && !locationName) {
		return `${programName} Admission Requirements for ${studentTypeName}`;
	}

	if (programName && locationName) {
		return `${programName} Admission Requirements for ${studentTypeName} in ${locationName}`;
	}

	return '';
};

export const getRequirementContent = async (studentType, program, location) => {
	return '';
};
