import { rm } from "node:fs/promises";
import { time } from "./common";

async function removeExcludedPaths() {
  const EXCLUDED_PATHS = [
    "app/api",
    "app/media",
    "app/ovc",
    "app/programs/undergraduate/requirements",
    "app/sitemap.ts",
  ];

  for (const path of EXCLUDED_PATHS) {
    await rm(path, { recursive: true, force: true });
  }
}

await time(async () => {});
