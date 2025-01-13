import { parseYamlFiles } from "../../../lib/file-utils";
import path from "path";

export async function yamlToMap({ path, schema, parser }) {
  const parsedFiles = await parseYamlFiles(path);

  return parsedFiles.reduce((acc, { path, content }) => {
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
}
