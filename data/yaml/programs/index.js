import * as ObjectHash from "object-hash";
import { glob } from "glob";
import { readFile, stat } from "fs/promises";
import * as YAML from "yaml";

const cache = new Map();

export async function getYamlData({ id, path, schema, parser, postProcessor, asArray = false }) {
  const paths = await glob(path);
  const getMap = async () => {
    const files = await Promise.all(
      paths.map(async (path) => {
        const file = (await readFile(path, "utf8")).toString();
        return { path: path, content: YAML.parse(file) };
      })
    );

    const map = files.reduce((acc, { path, content }) => {
      const parsed = schema.safeParse(content);

      if (!parsed.success) {
        throw new Error(`Failed to parse yaml file ${path}: ${parsed.error.toString()}`);
      }

      if (Array.isArray(parsed.data)) {
        parsed.data.forEach((item) => {
          acc[item.id] = typeof parser === "function" ? parser(item) : item;
        });
      } else {
        acc[content.id] = typeof parser === "function" ? parser(parsed.data) : parsed.data;
      }

      return acc;
    }, {});

    return typeof postProcessor === "function" ? postProcessor(map) : map;
  };

  // If the caller didn't define id, then this map should not be cached.
  if (!id) {
    const map = await getMap();
    return asArray ? Object.values(map) : map;
  }

  // Get the times that the yaml files were last modified
  const modifiedTimes = await Promise.all(
    paths.map(async (path) => {
      return (await stat(path)).mtime.toISOString();
    })
  );

  // We calculate a hash from the last modified times,
  // this will let us know if our cache is out of date, and needs to be recalculated
  const hash = ObjectHash(modifiedTimes);
  const cached = cache.get(id);

  // The cache is up to date, so we don't need to recalculate the map.
  if (cached && cached.hash === hash) {
    //console.log(`getMapFromYaml: Cache hit for ${id}`);
    return asArray ? Object.values(cached.map) : cached.map;
  }

  //console.log(`getMapFromYaml: Cache miss for ${id}`);

  // Cache is out of date, recalculate the map, and update the cache.
  const map = await getMap();
  cache.set(id, { hash, map });
  return asArray ? Object.values(map) : map;
}
