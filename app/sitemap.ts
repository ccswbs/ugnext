import type { MetadataRoute } from "next";
import { getAllBasicPagePaths } from "@/data/drupal/basic-page";
import { getAllProfilePaths } from "@/data/drupal/profile";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basicPages = await getAllBasicPagePaths();
  const profiles = await getAllProfilePaths();
  const paths = [
    ...profiles.map((path) => ({ url: `https://uoguelph.ca${path}` })),
    ...basicPages.map((path) => ({ url: `https://uoguelph.ca${path}` })),
  ];

  if (paths.length > 50000) {
    throw new Error(
      "Google has a limit of 50,000 URLs per sitemap. See https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-multiple-sitemaps for more information on splitting sitemap."
    );
  }

  return paths;
}
