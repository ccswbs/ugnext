import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getRoute, RouteEntity } from "@/data/drupal/route";
import { draftMode } from "next/headers";
import { getCacheTag, getNewsArticleCacheTags } from "@/data/drupal/cache";

function getTagsToRevalidate(entity: RouteEntity) {
  const tags: string[] = [];

  if ("id" in entity) {
    tags.push(getCacheTag(entity));
  }

  switch (entity.__typename) {
    case "NodeNews":
      const newsArticleCacheTags = getNewsArticleCacheTags(
        entity.unit.map((unit) => unit.id) ?? [],
        entity.category?.map((category) => category.id) ?? [],
        entity.tags?.map((tag) => tag.id) ?? []
      );

      tags.push(...newsArticleCacheTags);
      break;
    default:
      break;
  }

  return tags;
}
function revalidateEntity(entity: RouteEntity) {
  const tags = getTagsToRevalidate(entity);

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  switch (entity.__typename) {
    case "NodeUndergraduateRequirement":
      revalidatePath("/programs/undergraduate/requirements/[...slug]", "page");
      break;
  }
}

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const { isEnabled } = await draftMode();

  // User must provide a valid secret or be in draft mode to revalidate.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET && !isEnabled) {
    return new Response("Invalid secret or you are not in draft mode.", { status: 401 });
  }

  const path = searchParams.get("path");
  const tags = searchParams.get("tags");

  // Either tags or path must be provided.
  if (!path && !tags) {
    return new Response("Missing path or tags.", { status: 400 });
  }

  if (path) {
    const route = await getRoute(path);

    if (route && route.__typename === "RouteInternal" && route.entity) {
      revalidateEntity(route.entity);
    }

    revalidatePath(path);
  }

  if (tags) {
    tags.split(",").forEach((tag) => revalidateTag(tag, "max"));
  }

  return new Response("Revalidated.");
}

export { handler as GET, handler as POST };
