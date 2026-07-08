import { drupal } from "@/lib/drupal";
import { enableDraftMode } from "next-drupal/draft";
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response | never> {
  console.log("DRAFT 1");
  const searchParams = request.nextUrl.searchParams;
  console.log("DRAFT 2");
  const secret = searchParams.get("secret");
  console.log("DRAFT 3");
  let path = searchParams.get("path");
  console.log("DRAFT 4");

  // Manually enter draft mode if provided DRUPAL_PREVIEW_SECRET directly in the URL.
  if (secret === process.env.DRUPAL_PREVIEW_SECRET) {
    console.log("DRAFT 5");
    if (!path) {
      console.log("DRAFT 6");
      return NextResponse.json(
        {
          message: "Field 'path' is missing",
        },
        { status: 400 }
      );
    }
  console.log("DRAFT 7");
    if (URL.canParse(path)) {
      console.log("DRAFT 8");
      const url = new URL(path);
      path = url.pathname;
    }

    console.log("DRAFT 9");
    const draft = await draftMode();
    console.log("DRAFT 10");
    draft.enable();

    console.log("DRAFT 11");
    redirect(path);
  }

  console.log("DRAFT 12");
  // @ts-ignore
  return enableDraftMode(request, drupal);
}
