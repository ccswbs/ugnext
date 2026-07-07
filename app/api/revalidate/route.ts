import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { draftMode } from "next/headers";

/* TODO: Re-enable this once caching for linked revalidation is fixed. */
// import { getRoute } from "@/data/drupal/route";
// import { getPathsByEntity, getTagsToRevalidateByEntity } from "@/data/drupal/linked-revalidation";

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const { isEnabled } = await draftMode();

  // User must provide a valid secret or be in draft mode to revalidate.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET && !isEnabled) {
    return new Response("Invalid secret or you are not in draft mode.", { status: 401 });
  }

  const pathParam = searchParams.get("path");
  const tagsParam = searchParams.get("tags");

  if (!pathParam && !tagsParam) {
    return new Response("Missing path or tags.", { status: 400 });
  }

  const paths: string[] = [];
  const tags: string[] = [];

  if (pathParam) {
    paths.push(pathParam);

    // TODO: Enable when linked revalidation is fixed.
    /*const route = await getRoute(pathParam);

    if (route && route.__typename === "RouteInternal" && route.entity) {
      tags.push(...getTagsToRevalidateByEntity(route.entity));
      paths.push(...getPathsByEntity(route.entity));
    }*/
  }

  if (tagsParam) {
    tags.push(...tagsParam.split(","));
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  for (const path of paths) {
    revalidatePath(path, "page");
  }

  return Response.json({ tags, paths });
}

export { handler as GET, handler as POST };
