import fs from 'fs/promises'
import path from 'path';
import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';

const dir = path.join(process.cwd(), 'data', 'sqlite');

const db = await sqlite.open({
	filename:  path.join(dir, 'db.sqlite'),
	driver: sqlite3.Database
});

await db.exec(await fs.readFile(path.join(dir, 'programs', 'undergraduate.sql'), 'utf8'))
