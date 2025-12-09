import { glob } from "glob";
import path from "path";
import { yaml, YAML_DATA_ROOT } from "@/data/yaml";

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
  const story = await yaml(filepath);
  return story.data;
}
