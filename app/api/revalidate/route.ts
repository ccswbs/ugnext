import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getRoute } from "@/data/drupal/route";
import { draftMode } from "next/headers";

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path");
  const tags = searchParams.get("tags");
  const secret = searchParams.get("secret");
  const { isEnabled: isDraftMode } = await draftMode();

  // User must provide a valid secret or be in draft mode to revalidate.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET || !isDraftMode) {
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
      switch (route.entity.__typename) {
        case "NodeUndergraduateRequirement":
          revalidatePath("/programs/undergraduate/requirements/[...slug]", "page");
          break;
      }
    }
  }

  try {
    path && revalidatePath(path);
    tags?.split(",").forEach((tag) => revalidateTag(tag));

    return new Response("Revalidated.");
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

export { handler as GET, handler as POST };
