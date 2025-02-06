import { join } from "path";
import * as objectHash from "object-hash";
import { glob } from "glob";
import { readdir, readFile, stat } from "fs/promises";
import * as YAML from "yaml";

const cache = new Map();

export async function getYamlData({ id, path, schema, parser, postProcessor, listen }) {
  // Find all the paths that match the glob pattern the caller gave.
  const paths = await glob(path);

  // The caller can define a glob path that should be listened to but doesn't need to actually read.
  const listenPaths = typeof listen === "string" ? await glob(listen) : [];

  if (paths.length === 0) {
    throw new Error(`No files found matching the path: ${path}`);
  }

  // This function will read and parse all the YAML files that matched the glob.
  const getData = async () => {
    const files = await Promise.all(
      paths.map(async (path) => {
        try {
          // Read the file
          const file = await readFile(path, "utf8");

          // Parse the YAML
          const content = YAML.parse(file.toString());

          return { path: path, content: content };
        } catch (e) {
          throw new Error(`Failed to parse yaml file ${path}: ${e.toString()}`);
        }
      })
    );

    const data = files.map(({ path, content }) => {
      const validated = schema?.safeParse(content) ?? content;

      // If the caller passed a zod schema, and zod wasn't able to validate the data against it, then we throw an error
      if (schema && !validated.success) {
        throw new Error(`Failed to parse yaml file ${path}: ${validated.error.toString()}`);
      }

      // If the caller passed their own parser function, use it on the data.
      return typeof parser === "function" ? parser(validated.data) : validated.data;
    });

    // If the caller pass a post-processor function, use it on all the data.
    return typeof postProcessor === "function" ? postProcessor(data) : data;
  };

  // If the caller didn't define id, then this data should not be cached.
  if (!id) {
    return await getData();
  }

  // Get the times that the YAML files were last modified
  // (both the ones we read, and the ones that we are only listening to)
  const modifiedTimes = await Promise.all(
    [...paths, ...listenPaths].map(async (path) => {
      return (await stat(path)).mtime.toISOString();
    })
  );

  // We calculate a hash from the last modified times,
  // this will let us know if our cache is out of date, and needs to be updated
  const hash = objectHash?.(modifiedTimes);
  const cached = cache.get(id);

  // The cache is up to date, so we don't need to reread and reparse the data.
  if (cached && cached.hash === hash && cached.data) {
    //console.log(`Cache is up to date for ${id}, using cached data. (hash: ${hash}, cached hash: ${cached?.hash})`);
    return cached.data;
  }

  // Cache is out of date, reread and reparse the data, and update the cache.
  //console.log(`Cache is out of date for ${id}, re-reading and re-parsing the data. (hash: ${hash}, cached hash: ${cached?.hash})`);
  const data = await getData();
  cache.set(id, { hash, data });
  return data;
}

export const listFiles = async (directory) => {
  const dirents = await readdir(directory, { withFileTypes: true, recursive: true });
  const fileNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => join(dirent.path, dirent.name));
  return fileNames;
};
