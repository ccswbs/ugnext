import { join } from "path";
import objectHash from "object-hash";
import { glob } from "glob";
import { readdir, readFile, stat } from "fs/promises";
import * as YAML from "yaml";
import type { ZodSchema } from "zod";

type CachedValue<T> = {
  hash: string;
  data: T;
};

type GetYamlDataOptions<TInput = unknown, TParsed = TInput, TResult = TParsed[]> = {
  id?: string;
  path: string;
  schema?: ZodSchema<TInput>;
  parser?: (data: TInput) => TParsed;
  postProcessor?: (data: TParsed[]) => TResult;
  listen?: string;
};

const cache = new Map<string, CachedValue<unknown>>();

export async function getYamlData<TInput = unknown, TParsed = TInput, TResult = TParsed[]>({
  id,
  path,
  schema,
  parser,
  postProcessor,
  listen,
}: GetYamlDataOptions<TInput, TParsed, TResult>): Promise<TResult | TParsed[]> {
  // Find all the paths that match the glob pattern the caller gave.
  const paths = await glob(path);

  // The caller can define a glob path that should be listened to but doesn't need to actually read.
  const listenPaths = typeof listen === "string" ? await glob(listen) : [];

  if (paths.length === 0) {
    throw new Error(`No files found matching the path: ${path}`);
  }

  // This function will read and parse all the YAML files that matched the glob.
  const getData = async (): Promise<TResult | TParsed[]> => {
    const files = await Promise.all(
      paths.map(async (path) => {
        try {
          // Read the file
          const file = await readFile(path, "utf8");

          // Parse the YAML
          const content = YAML.parse(file.toString()) as unknown;

          return { path, content };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to parse yaml file ${path}: ${message}`);
        }
      })
    );

    const data = files.map(({ path, content }) => {
      const validated = schema?.safeParse(content);

      // If the caller passed a zod schema, and zod wasn't able to validate the data against it, then we throw an error
      if (schema && validated && !validated.success) {
        throw new Error(`Failed to parse yaml file ${path}: ${validated.error.toString()}`);
      }

      const parsedData = schema && validated?.success ? validated.data : (content as TInput);

      // If the caller passed their own parser function, use it on the data.
      return typeof parser === "function" ? parser(parsedData) : (parsedData as unknown as TParsed);
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
  const hash = objectHash(modifiedTimes);
  const cached = cache.get(id) as CachedValue<TResult | TParsed[]> | undefined;

  // The cache is up to date, so we don't need to reread and reparse the data.
  if (cached && cached.hash === hash && cached.data) {
    return cached.data;
  }

  // Cache is out of date, reread and reparse the data, and update the cache.
  const data = await getData();
  cache.set(id, { hash, data });
  return data;
}

export const listFiles = async (directory: string): Promise<string[]> => {
  const dirents = await readdir(directory, { withFileTypes: true, recursive: true });

  return dirents.filter((dirent) => dirent.isFile()).map((dirent) => join(dirent.parentPath, dirent.name));
};

export async function* yaml(globPattern: string): AsyncGenerator<unknown | Error> {
  try {
    const filePaths = await glob(globPattern);

    if (filePaths.length === 0) {
      console.warn(`No files found matching the pattern: ${globPattern}`);
      return;
    }

    for (const filePath of filePaths) {
      try {
        const fileContent = await readFile(filePath, "utf8");
        const text = fileContent.toString();
        const parsedYaml = YAML.parse(text) as unknown;
        yield parsedYaml;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        yield new Error(`Error processing file ${filePath}: ${message}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    yield new Error(`Error finding files for glob pattern ${globPattern}: ${message}`);
  }
}
