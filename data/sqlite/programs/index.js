import { db, parseJSONColumns } from '@/data/sqlite';

export const getUndergraduatePrograms = async () =>
	(await db.all(`SELECT * FROM programs_undergraduate`)).map((row) =>
		parseJSONColumns(row, 'degrees', 'types', 'tags'),
	);

export const getGraduatePrograms = async () =>
	(await db.all(`SELECT * FROM programs_graduate`)).map((row) => parseJSONColumns(row, 'degrees', 'types', 'tags'));

export const getCertificateAndDiplomaPrograms = async () =>
	(await db.all(`SELECT * FROM programs_certificate_and_diplomas`)).map((row) =>
		parseJSONColumns(row, 'types', 'tags'),
	);

export const getContinuingEducationPrograms = async () =>
	(await db.all(`SELECT * FROM programs_continuing_education`)).map((row) => parseJSONColumns(row, 'types', 'tags'));
