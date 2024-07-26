import { db, parseJSONColumns } from '@/data/sqlite';
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

export const validateRequirementsSlug = async (slug) => {
	return false;
};
