import { db, parseJSONColumns } from '@/data/sqlite';
import SQL from 'sql-template-strings';

export const getStudentTypes = async () => {
	return await db.all(SQL`
		SELECT
			*
		FROM
			admissions_student_types
	`);
};

export const getLocations = async () => {
	return {
		provinces: await db.all(SQL`
			SELECT
				*
			FROM
				provinces
		`),
		countries: await db.all(SQL`
			SELECT
				*
			FROM
				countries
		`),
		systemsOfStudy: await db.all(SQL`
			SELECT
				*
			FROM
				systems_of_study
		`),
	};
};

export const getPrograms = async () => {
	return (
		await db.all(SQL`
			SELECT
				title,
				degrees
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
	).map((row) => parseJSONColumns(row, 'degrees'));
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
