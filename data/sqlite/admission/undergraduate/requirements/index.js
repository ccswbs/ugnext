import { db, parseJSONColumns } from '@/data/sqlite';
import SQL from 'sql-template-strings';

export const getStudentTypes = async () => {
	return await db.all(SQL`
		SELECT
			*
		FROM
			admission_requirements_student_types
	`);
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
	return (
		await db.all(SQL`
			SELECT
				title,
				degrees,
				tags
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
		`)
	).map((row) => parseJSONColumns(row, 'degrees', 'tags'));
};

export const getDegrees = async () => {
	return await db.all(SQL`
		WITH
			degree_set AS (
				SELECT
					JSON_EACH.value AS degree
				FROM
					programs_undergraduate,
					json_each(programs_undergraduate.degrees)
			)
		SELECT DISTINCT
			degree
		FROM
			degree_set;
	`);
};
