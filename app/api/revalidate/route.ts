import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getRoute } from "@/data/drupal/route";

/* TODO: Re-enable this once caching for linked revalidation is fixed. */
// import { draftMode } from "next/headers";
// import { getPathsByEntity, getTagsToRevalidateByEntity } from "@/data/drupal/linked-revalidation";

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");
  const tags = searchParams.get("tags");

  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) {
    return new Response("Invalid secret.", { status: 401 });
  }

  // Either tags or path must be provided.
  if (!path && !tags) {
    return new Response("Missing path or tags.", { status: 400 });
  }

  // Some node types might require some custom revalidation logic.
  if (path) {
    const route = await getRoute(path);

    if (route && route.__typename === "RouteInternal" && route.entity) {
      switch (route.entity.__typename) {
        case "NodeUndergraduateRequirement":
          revalidatePath("/programs/undergraduate/requirements/[...slug]", "page");
          break;
      }
    }
  }

  try {
    path && revalidatePath(path);
    tags?.split(",").forEach((tag) => revalidateTag(tag, "max"));

    return new Response("Revalidated.");
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }

  // --- Code for LINKED REVALIDATION
  /* TODO: Re-enable this once caching for linked revalidation is fixed. */
  
  // const searchParams = request.nextUrl.searchParams;
  // const secret = searchParams.get("secret");
  // const { isEnabled } = await draftMode();

  // User must provide a valid secret or be in draft mode to revalidate.
  // if (secret !== process.env.DRUPAL_REVALIDATE_SECRET && !isEnabled) {
  //   return new Response("Invalid secret or you are not in draft mode.", { status: 401 });
  // }

  // const pathParam = searchParams.get("path");
  // const tagsParam = searchParams.get("tags");

  // if (!pathParam && !tagsParam) {
  //   return new Response("Missing path or tags.", { status: 400 });
  // }

  // const paths: string[] = [];
  // const tags: string[] = [];

  // if (pathParam) {
  //   paths.push(pathParam);

  //   const route = await getRoute(pathParam);

  //   if (route && route.__typename === "RouteInternal" && route.entity) {
  //     tags.push(...getTagsToRevalidateByEntity(route.entity));
  //     paths.push(...getPathsByEntity(route.entity));
  //   }
  // }

  // if (tagsParam) {
  //   tags.push(...tagsParam.split(","));
  // }

  // for (const tag of tags) {
  //   revalidateTag(tag, { expire: 0 });
  // }

  // for (const path of paths) {
  //   revalidatePath(path, "page");
  // }

  // return Response.json({ tags, paths });
}

export { handler as GET, handler as POST };
