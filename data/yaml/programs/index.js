import { parseYamlFiles } from "../../../lib/file-utils";

export async function yamlToMap(path, schema) {
  const parsedFiles = await parseYamlFiles(path);

  return parsedFiles.reduce((acc, { path, content }) => {
    const parsed = schema.safeParse(content);

    if (!parsed.success) {
      throw new Error(`Failed to parse yaml file ${path}: ${parsed.error.toString()}`);
    }

    acc[content.id] = parsed.data;
    return acc;
  }, {});
}
