import { drupal } from "@/lib/drupal";
import { enableDraftMode } from "next-drupal/draft";
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest): Promise<Response | never> {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  let path = searchParams.get("path");

  // Manually enter draft mode if provided DRUPAL_PREVIEW_SECRET directly in the URL and in development mode.
  // This is useful for testing draft mode locally.
  if (secret === process.env.DRUPAL_PREVIEW_SECRET && process.env.NODE_ENV !== "production") {
    if (!path) {
      return NextResponse.json(
        {
          message: "Field 'path' is missing",
        },
        { status: 400 }
      );
    }
    if (URL.canParse(path)) {
      const url = new URL(path);
      path = url.pathname;
    }

    const draft = await draftMode();
    draft.enable();

    (await cookies()).set({
      name: "STYXKEY_draft",
      value: "1",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    redirect(path);
  }

  (await cookies()).set({
    name: "STYXKEY_draft",
    value: "1",
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // @ts-ignore
  return enableDraftMode(request, drupal);
}
