import { type ProcessedBasicPage } from "@/data/drupal/basic-page";

/*
 * Cache tags are used to determine if cache entries are related to a specific entity.
 * For example, a cache tag for a primary navigation would be "TermPrimaryNavigation-ID-123"
 * We can then mark cache entries that should be invalidated when primary navigation changes with "TermPrimaryNavigation-ID-123"
 * For example, with basic pages, we can mark the basic page with "TermPrimaryNavigation-ID-123", so that when the primary navigation changes, the basic page is invalidated.
 */

/*
 * Gets the cache tag that can be used to link an arbitrary entity to a cache entry by combining its typename and id
 */
export function getCacheTag(entity: { __typename: string; id: string }) {
  return `${entity.__typename}-ID-${entity.id}`;
}

export function getNewsArticleCacheTags(units: string[], categories: string[], tags: string[]) {
  const cacheTags: string[] = [];

  for (const unit of units) {
    cacheTags.push(`NodeNews-Unit-${unit}`);
  }

  for (const category of categories) {
    cacheTags.push(`NodeNews-Category-${category}`);
  }

  for (const tag of tags) {
    cacheTags.push(`NodeNews-Tag-${tag}`);
  }

  return cacheTags;
}

/*
 * Gets the cache tags that can be used to invalidate a basic page
 */
export function getBasicPageLinkedCacheTags(page: ProcessedBasicPage) {
  const tags = [];

  if (page.primaryNavigation) {
    tags.push(getCacheTag(page.primaryNavigation));

    if (page.primaryNavigation.customFooter) {
      tags.push(getCacheTag(page.primaryNavigation.customFooter));
    }
  }

  for (const widget of page.widgets) {
    switch (widget.__typename) {
      case "ParagraphFeaturedNews":
        const newsArticleCacheTags = getNewsArticleCacheTags(
          widget.units?.map((unit) => unit.id) ?? [],
          widget.categories?.map((category) => category.id) ?? [],
          widget.tags?.map((tag) => tag.id) ?? []
        );

        tags.push(...newsArticleCacheTags);
        break;
      default:
        break;
    }
  }

  return tags;
}
