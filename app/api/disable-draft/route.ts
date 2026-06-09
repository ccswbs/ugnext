import { disableDraftMode } from "next-drupal/draft";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") ?? "/";

  await disableDraftMode();

  return NextResponse.redirect(new URL(path, request.url));
}
