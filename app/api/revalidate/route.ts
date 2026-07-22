import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { getRoute } from "@/data/drupal/route";
import { getPathsByEntity /*getTagsToRevalidateByEntity*/ } from "@/data/drupal/linked-revalidation";

export const dynamic = "force-dynamic";

async function revalidate(paths: string[] = [], tags: string[] = []) {
  for (const path of paths) {
    const route = await getRoute(path);

    if (route && route.__typename === "RouteInternal" && route.entity) {
      // TODO: Enable when linked revalidation is fixed.
      //tags.push(...getTagsToRevalidateByEntity(route.entity));
      paths.push(...getPathsByEntity(route.entity));
    }
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  for (const path of paths) {
    if (/(^|\/)\[(?:\.\.\.)?[A-Za-z0-9_-]+](?=\/|$)/.test(path)) {
      revalidatePath(path, "page");
    } else {
      revalidatePath(path);
    }
  }

  return NextResponse.json({ message: "Revalidation successful.", tags, paths });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const { isEnabled } = await draftMode();

  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET && !isEnabled) {
    return NextResponse.json({ message: "Invalid secret or you are not in draft mode." }, { status: 401 });
  }

  const pathParam = searchParams.get("path");
  const tagsParam = searchParams.get("tags");

  return await revalidate(pathParam ? [pathParam] : [], tagsParam?.split(",").filter(Boolean) ?? []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = body.secret;
  const { isEnabled } = await draftMode();

  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET && !isEnabled) {
    return NextResponse.json({ message: "Invalid secret or you are not in draft mode." }, { status: 401 });
  }

  return await revalidate(
    typeof body.path === "string" ? [body.path] : [],
    typeof body.tags === "string" ? body.tags.filter(Boolean) : []
  );
}
