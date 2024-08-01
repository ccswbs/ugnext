import { db } from '@/data/sqlite';
import SQL from 'sql-template-strings';

export const getStudentTypes = async () => {
	return (
		await db.all(SQL`
			SELECT
				*
			FROM
				admission_requirements_student_types
		`)
	).map((type) => ({
		...type,
		location_dependent: Boolean(type.location_dependent),
		program_dependent: Boolean(type.program_dependent),
	}));
};

export const getLocations = async () => {
	return {
		domestic: await db.all(SQL`
			SELECT
				*
			FROM
				admission_requirements_locations
			WHERE
				type = 'domestic'
		`),
		international: await db.all(SQL`
			SELECT
				*
			FROM
				admission_requirements_locations
			WHERE
				type = 'international'
		`),
		curriculums: await db.all(SQL`
			SELECT
				*
			FROM
				admission_requirements_locations
			WHERE
				type = 'curriculum'
		`),
	};
};

export const getPrograms = async () => {
	return await db.all(SQL`
		SELECT
			id,
			name
		FROM
			programs_undergraduate
		WHERE
			EXISTS (
				SELECT
					1
				FROM
					json_each(types)
				WHERE
					value = 'major'
			)
	`);
};

export const slugToRequirement = (slug) => {
	return {
		studentType: slug[0],
		program: slug.length !== 1 ? slug[1] : null,
		location: slug.length === 3 ? slug[2] : null,
	};
};

export const isValidRequirement = async (studentType, program, location) => {
	const studentTypeQuery = await db.get(SQL`
		SELECT
			COUNT(*),
			location_dependent,
			program_dependent
		FROM
			admission_requirements_student_types
		WHERE
			id = ${studentType}
	`);

	// Check if there exists a student type with the id (retrieved from the slug) in the database
	if (studentTypeQuery['COUNT(*)'] === 0) {
		return false;
	}

	// if the student type is location independent, then the slug shouldn't contain a program id
	if (!studentTypeQuery.program_dependent && program) {
		return false;
	}

	// if the student type is location independent, then the slug shouldn't contain a location id
	if (!studentTypeQuery.location_dependent && location) {
		return false;
	}

	const programQuery = await db.get(SQL`
		SELECT
			COUNT(*)
		FROM
			programs_undergraduate
		WHERE
			id = ${program}
	`);

	// If the student type is program-dependent, and we weren't able to retrieve a program,
	// then the slug is invalid.
	if (studentTypeQuery.program_dependent && programQuery['COUNT(*)'] === 0) {
		return false;
	}

	const locationQuery = await db.get(SQL`
		SELECT
			COUNT(*)
		FROM
			admission_requirements_locations
		WHERE
			id = ${location}
	`);

	// If the student type is location-dependent, and we weren't able to retrieve a location,
	// then the slug is invalid.
	if (studentTypeQuery.location_dependent && locationQuery['COUNT(*)'] === 0) {
		return false;
	}

	return true;
};

export const getRequirementTitle = async (studentType, program, location) => {
	const studentTypeName = (
		await db.get(SQL`
			SELECT
				name
			FROM
				admission_requirements_student_types
			WHERE
				id = ${studentType}
		`)
	)?.name
		?.replace('Student', 'Students')
		?.replace('Graduate', 'Graduates');

	if (!program && !location) {
		return `Undergraduate Admission Requirements for ${studentTypeName}`;
	}

	const programName = (
		await db.get(SQL`
			SELECT
				name
			FROM
				programs_undergraduate
			WHERE
				id = ${program}
		`)
	)?.name;

	const locationName = (
		await db.get(SQL`
			SELECT
				name
			FROM
				admission_requirements_locations
			WHERE
				id = ${location}
		`)
	)?.name;

	if (program && !location) {
		return `${programName} Admission Requirements for ${studentTypeName}`;
	}

	if (program && location) {
		return `${programName} Admission Requirements for ${studentTypeName} in ${locationName}`;
	}

	return '';
};

export const getRequirementContent = async (studentType, program, location) => {
	return (
		await db.get(SQL`
			SELECT
				content
			FROM
				admission_requirements_undergraduate
			WHERE
				student_type IS ${studentType ?? null}
				AND program IS ${program ?? null}
				AND location IS ${location ?? null}
		`)
	)?.content ?? '';
};
