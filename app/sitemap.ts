import type { MetadataRoute } from "next";
import { getAllBasicPagePaths } from "@/data/drupal/basic-page";
import { getAllProfilePaths } from "@/data/drupal/profile";
import { getAllLegacyNewsArticlePaths } from "@/data/drupal/legacy-news";
import { getAllNewsArticlePaths } from "@/data/drupal/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mappingFunc = (path: string) => ({ url: `https://www.uoguelph.ca${path}` });

  const basicPages = getAllBasicPagePaths();
  const profiles = getAllProfilePaths();
  const legacyNews = getAllLegacyNewsArticlePaths();
  const news = getAllNewsArticlePaths();

  const paths = (await Promise.all([basicPages, profiles, legacyNews, news])).flat().map(mappingFunc);

  if (paths.length > 50000) {
    throw new Error(
      "Google has a limit of 50,000 URLs per sitemap. See https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-multiple-sitemaps for more information on splitting sitemap."
    );
  }

  return paths;
}
