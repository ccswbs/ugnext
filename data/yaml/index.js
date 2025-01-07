import { Database } from "bun:sqlite";

export const db = new Database(process.cwd() + '/data/yaml/database.db');
