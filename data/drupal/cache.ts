import { type ProcessedBasicPage } from "@/data/drupal/basic-page";
import { RouteEntity } from "@/data/drupal/route";

/*
 * Cache tags are used to determine if cache entries are related to a specific entity.
 * For example, a cache tag for a primary navigation would be "TermPrimaryNavigation-ID-123"
 * We can then mark cache entries that should be invalidated when primary navigation changes with "TermPrimaryNavigation-ID-123"
 * For example, with basic pages, we can mark the basic page with "TermPrimaryNavigation-ID-123", so that when the primary navigation changes, the basic page is invalidated.
 */

const CACHE_TAG_FEATURED_NEWS = "Featured-News";

/*
 * Gets the cache tag that can be used to link an arbitrary entity to a cache entry by combining its typename and id
 */
export function getCacheTag(entity: { __typename: string; id: string }) {
  return `${entity.__typename}-ID-${entity.id}`;
}

/*
 * Get the tags that should be revalidated when an entity is updated
 */
export function getTagsToRevalidateByEntity(entity: RouteEntity) {
  const tags: string[] = [];

  if ("id" in entity) {
    tags.push(getCacheTag(entity));
  }

  switch (entity.__typename) {
    case "NodeNews":
      /* When a news article is updated, we need to revalidate any pages that use the featured news widget.
       * Unfortunately, this will not be limited to only pages with feature news widgets that would actually use the updated news article.
       * Although, since there will most likely only be a few pages with featured news widgets, this is not a major issue.
       */

      tags.push(CACHE_TAG_FEATURED_NEWS);
      break;
    default:
      break;
  }

  return tags;
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
        tags.push(CACHE_TAG_FEATURED_NEWS);
        break;
      default:
        break;
    }
  }

  return tags;
}
