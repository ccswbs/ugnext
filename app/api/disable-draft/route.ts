import { disableDraftMode } from "next-drupal/draft";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // let path = searchParams.get("path") ?? "/";
  let path = searchParams.get("path");

  console.log("-1path----->>>>" + path);

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

  console.log("-2path------>>>>" + path);

  const originalUrl = request.nextUrl.protocol + request.headers.get('host') + request.nextUrl.pathname;

  console.log("-3originalURL------>>>>" + originalUrl);


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

  console.log("-4REQUEST.url ------>>>>" + request.url);

  return NextResponse.redirect(new URL(path, request.url));
}

