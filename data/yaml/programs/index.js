import * as ObjectHash from "object-hash";
import { glob } from "glob";
import { readFile, stat } from "fs/promises";
import * as YAML from "yaml";

const cache = new Map();

export async function getYamlData({ id, path, schema, parser, postProcessor }) {
  const paths = await glob(path);
  const getData = async () => {
    const files = await Promise.all(
      paths.map(async (path) => {
        const file = (await readFile(path, "utf8")).toString();
        return { path: path, content: YAML.parse(file) };
      })
    );

    const data = files.map(({ path, content }) => {
      const parsed = schema.safeParse(content);

      if (!parsed.success) {
        throw new Error(`Failed to parse yaml file ${path}: ${parsed.error.toString()}`);
      }

      return typeof parser === "function" ? parser(parsed.data) : parsed.data;
    });

    return typeof postProcessor === "function" ? postProcessor(data) : data;
  };

  // If the caller didn't define id, then this data should not be cached.
  if (!id) {
    return await getData();
  }

  // Get the times that the YAML files were last modified
  const modifiedTimes = await Promise.all(
    paths.map(async (path) => {
      return (await stat(path)).mtime.toISOString();
    })
  );

  // We calculate a hash from the last modified times,
  // this will let us know if our cache is out of date, and needs to be updated
  const hash = ObjectHash(modifiedTimes);
  const cached = cache.get(id);

  // The cache is up to date, so we don't need to recalculate the data.
  if (cached && cached.hash === hash) {
    return cached.data;
  }

  // Cache is out of date, recalculate the data, and update the cache.
  const data = await getData();
  cache.set(id, { hash, data });
  return data;
}
