import { disableDraftMode } from "next-drupal/draft";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") ?? "/";

  await disableDraftMode();

  (await cookies()).set({
    name: "STYXKEY_draft",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });


  return NextResponse.redirect(new URL(path, request.url));
}

