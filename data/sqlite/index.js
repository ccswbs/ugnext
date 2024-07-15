import path from 'path';
import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';

export const db = await sqlite.open({
	filename: path.join(process.cwd(), 'data', 'sqlite', 'db.sqlite3'),
	driver: sqlite3.Database,
});

export const parseJSONColumns = (row, ...cols) => {
	const parsed = {...row};

	for(const col of cols) {
		parsed[col] = JSON.parse(row[col]);
	}

	return parsed;
}