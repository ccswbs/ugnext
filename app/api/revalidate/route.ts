import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getRoute } from "@/data/drupal/route";
import { draftMode } from "next/headers";

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path");
  const tags = searchParams.get("tags");
  const secret = searchParams.get("secret");
  const { isEnabled } = await draftMode();

  // User must provide a valid secret or be in draft mode to revalidate.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET && !isEnabled) {
    return new Response("Invalid secret or you are not in draft mode.", { status: 401 });
  }

  // Either tags or path must be provided.
  if (!path && !tags) {
    return new Response("Missing path or tags.", { status: 400 });
  }

  // Some node types might require some custom revalidation logic.
  if (path) {
    const route = await getRoute(path);

    if (route && route.__typename === "RouteInternal" && route.entity) {
      let idCacheTag = "";

      if ("id" in route.entity) {
        idCacheTag = `${route.entity.__typename}-ID-${route.entity.id}`;
        console.log(`Revalidating entity of type ${route.entity.__typename} with ID ${route.entity.id}`);
      }

      switch (route.entity.__typename) {
        case "TermPrimaryNavigation":
          // Revalidate routes tagged with this primary navigation's id
          revalidateTag(idCacheTag, "max");

          // If the primary navigation has a custom footer, revalidate pages tagged with the footer's id
          if (route.entity.customFooter) {
            revalidateTag(`${route.entity.__typename}-ID-${route.entity.customFooter.id}`, "max");
          }
          break;
        case "NodeCustomFooter":
        case "NodeProfile":
        case "NodePage":
          revalidateTag(idCacheTag, "max");
          break;
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
}

export { handler as GET, handler as POST };
