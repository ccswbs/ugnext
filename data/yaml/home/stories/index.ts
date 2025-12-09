import { glob } from "glob";
import path from "path";
import { yaml, YAML_DATA_ROOT } from "@/data/yaml";
import * as fs from "fs/promises";

export type HomeStory = {
  id: string;
  firstName: string;
  lastName: string;
  quotes: string[];
  image: {
    src: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
    alt: string;
  };
};

export const HOME_STORIES_ROOT = path.join(YAML_DATA_ROOT, "home", "stories");

export async function getStoryById(id: string) {
  const filepath = path.join(HOME_STORIES_ROOT, `${id}.yml`);

  try {
    await fs.access(filepath);
  } catch (e) {
    console.error(`getStoryById: Could not find story with id ${id}`);
    return null;
  }

  let file: Awaited<ReturnType<typeof yaml>>;

  try {
    file = await yaml(filepath);
  } catch (e) {
    console.error(`getStoryById: Could not parse story with id ${id}`);
    return null;
  }

  if (!("first-name" in file.data)) {
    console.error(`getStoryById: Missing first-name field in ${filepath}`);
    return null;
  }

  if (!("last-name" in file.data)) {
    console.error(`getStoryById: Missing last-name field in ${filepath}`);
    return null;
  }

  if (!("quotes" in file.data)) {
    console.error(`getStoryById: Missing quotes field in ${filepath}`);
    return null;
  }

  if (!Array.isArray(file.data.quotes) || file.data.quotes.length === 0) {
    console.error(`getStoryById: quotes field in ${filepath} must be an array with at least one element`);
    return null;
  }

  if (!("image" in file.data)) {
    console.error(`getStoryById: Missing image field in ${filepath}`);
    return null;
  }

  if (!("src" in file.data.image)) {
    console.error(`getStoryById: Missing src field in image field in ${filepath}`);
    return null;
  }

  if (!("alt" in file.data.image)) {
    console.error(`getStoryById: Missing alt field in image field in ${filepath}`);
    return null;
  }

  return {
    id: file.filename,
    firstName: file.data["first-name"],
    lastName: file.data["last-name"],
    quotes: file.data.quotes,
    image: {
      src: file.data.image.src,
      width: file.data.image.width,
      height: file.data.image.height,
      alt: file.data.image.alt,
    },
  } as HomeStory;
}
