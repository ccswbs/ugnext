import studentTypes from './student-types.yml';
import locations from './locations.yml';
import programs from '@/data/yaml/programs/undergraduate.yml';
import fragments from './fragments.yml';

export const getAllStudentTypes = async () => {
	return studentTypes;
};

export const getAllLocations = async () => {
	return locations.reduce((acc, location) => {
		acc[location.type] ??= [];
		acc[location.type].push(location);

		return acc;
	}, {});
};

export const getAllPrograms = async () => {
	return programs.filter((program) => program.types.includes('major'));
};

export const getStudentType = async (id) => {
	return studentTypes.find((type) => type.id === id);
};

export const getProgram = async (id) => {
	return programs.find((program) => program.id === id);
};

export const getLocation = async (id) => {
	return locations.find((location) => location.id === id);
};

export const slugToRequirement = async (slug) => {
	const ids = {
		studentType: slug[0],
		program: slug.length !== 1 ? slug[1] : null,
		location: slug.length === 3 ? slug[2] : null,
	};

	const requirement = {
		studentType: await getStudentType(ids.studentType),
		program: await getProgram(ids.program),
		location: await getLocation(ids.location),
	};

	// Determine if the slug was able to be correctly mapped to a valid requirement object
	if (
		// No student type
		!requirement.studentType ||
		// Student type is not program-dependent so program id shouldn't be in the slug
		(!requirement.studentType.isProgramDependent && ids.program) ||
		// Student type is not location-dependent so location id shouldn't be in the slug
		(!requirement.studentType.isLocationDependent && ids.location) ||
		// Student type is program-dependent so need to have retrieved a program object
		(requirement.studentType.isProgramDependent && !requirement.program) ||
		// Student type is location-dependent so need to have retrieved a location object
		(requirement.studentType.isLocationDependent && !requirement.location)
	) {
		return null;
	}

	return requirement;
};

export const getRequirementTitle = ({ studentType, program, location }) => {
	const studentTypeName = studentType?.name?.replace('Student', 'Students')?.replace('Graduate', 'Graduates');

	if (!program && !location) {
		return `Undergraduate Admission Requirements for ${studentTypeName}`;
	}

	if (program && !location) {
		return `${program.name} Admission Requirements for ${studentTypeName}`;
	}

	if (!program && location) {
		return location.type === 'curriculum'
			? `Undergraduate Admission Requirements for ${location.name} Students/Graduates`
			: `Undergraduate Admission Requirements for ${studentTypeName} in ${location.name}`;
	}

	if (program && location) {
		return location.type === 'curriculum'
			? `${program.name} Admission Requirements for ${location.name} Students/Graduates`
			: `${program.name} Admission Requirements for ${studentTypeName} in ${location.name}`;
	}
};

export const getRequirementContent = async (requirement) => {
	return fragments
		.filter((fragment) => {
			const validate = (name) => {
				const fragmentID = fragment[name];
				const requirementID = requirement[name]?.id;

				return (
					fragmentID === null ||
					fragmentID === requirementID ||
					(Array.isArray(fragmentID) && fragmentID.includes(requirementID))
				);
			};

			return validate('studentType') && validate('program') && validate('location');
		})
		.sort((a, b) => {
			return a.rank - b.rank;
		})
		.reduce((acc, value) => acc.concat(value.content), '');
};
