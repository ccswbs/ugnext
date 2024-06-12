import { readdirSync } from 'fs';
import { join } from 'path';
import { readYamlFile } from './file-utils';

// Source: https://ianmitchell.dev/blog/building-a-nextjs-blog-static-mdx
export async function getAllGraduatePrograms() {
  const directory = join(process.cwd(), "data", "programs","graduate");
	const files = readdirSync(directory);

	// Loop through all the files and import them
	const entries = await Promise.all(
		files.map((file) => {
			let path = join(directory,file);
			return readYamlFile(path);
		}),
	);
 
	const programs = entries.map((entry, index) => ({
		// Use filename as our slug
		slug: entry.slug
	}));

  return programs;
}
