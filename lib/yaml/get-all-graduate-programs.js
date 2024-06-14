import { join } from 'path';
import { listFiles, readYamlFile } from '../file-utils';

	// Initial source: https://ianmitchell.dev/blog/building-a-nextjs-blog-static-mdx
export async function getAllGraduatePrograms() {
  const directory = join(process.cwd(), "data", "programs", "graduate");
	const filePaths = await listFiles(directory);

	// Loop through all the files and read them
	const entries = await Promise.all(
		filePaths.map((path) => {
			return readYamlFile(path);
		}),
	);
	
	const programs = entries.map((entry, index) => ({
		slug: entry.slug,
		data: entry,
	}));

  return programs;
}
