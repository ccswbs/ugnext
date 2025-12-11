import path from "path";
import { yaml, YAML_DATA_ROOT } from "@/data/yaml";
import * as fs from "fs/promises";
import { clamp } from "@uoguelph/react-components";

export type StoryData = {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  quote: string;
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

  if (!("quote" in file.data)) {
    console.error(`getStoryById: Missing quote field in ${filepath}`);
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
    quote: file.data.quote,
    image: {
      src: file.data.image.src,
      width: file.data.image.width,
      height: file.data.image.height,
      alt: file.data.image.alt,
    },
    title: file.data.title ?? null,
  } as StoryData;
}

export async function getActiveStory() {
  let story: StoryData | null = null;

  if (process.env.USE_TESTING_DATA === "true" || typeof process.env.HOME_ACTIVE_STORY_ID !== "string") {
    story = await getStoryById("asha-edwin");
  } else {
    story = await getStoryById(process.env.HOME_ACTIVE_STORY_ID);
  }

  if (story === null) {
    return null;
  }

  return story;
}
