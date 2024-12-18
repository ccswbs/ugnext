import { parseYamlFiles } from "@/lib/file-utils";
import path from "path";

export const getLocations = async () => {
  const data = await parseYamlFiles(path.join(process.cwd(), "data", "yaml", "maps", "*.yml"));
};
