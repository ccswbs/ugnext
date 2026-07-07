import { drupal } from "@/lib/drupal";
import { enableDraftMode } from "next-drupal/draft";
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(request: NextRequest): Promise<Response | never> {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  let path = searchParams.get("path");

  // Manually enter draft mode if provided DRUPAL_PREVIEW_SECRET directly in the URL.
  if (secret === process.env.DRUPAL_PREVIEW_SECRET && path) {
    if (URL.canParse(path)) {
      const url = new URL(path);
      path = url.pathname;
    }

    const draft = await draftMode();
    draft.enable();

    return NextResponse.redirect(new URL(path, request.url));
  }

  // @ts-ignore
  return enableDraftMode(request, drupal);
}
