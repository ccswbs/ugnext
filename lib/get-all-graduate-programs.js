import { join } from 'path';
import { listFiles, readYamlFile } from './file-utils';

// Source: https://ianmitchell.dev/blog/building-a-nextjs-blog-static-mdx
export async function getAllGraduatePrograms() {
  const directory = join(process.cwd(), "data", "programs", "graduate");
	const filePaths = await listFiles(directory);

	console.log(filePaths)

	// Loop through all the files and read them
	const entries = await Promise.all(
		filePaths.map((path) => {
			console.log("-----" + path)
			return readYamlFile(path);
		}),
	);
	
	const programs = entries.map((entry, index) => ({
		// Use filename as our slug
		slug: entry.slug
	}));
 
	// const programs = entries.map((entry, index) => ({
	// 	program: entry.split(".")[0]
	// }));

  return programs;
}
