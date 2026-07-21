import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

let cachedPreviewModeId: string | null | undefined;

function getPreviewModeId(): string | null {
  if (cachedPreviewModeId !== undefined) {
    return cachedPreviewModeId;
  }
  try {
    const manifestPath = path.join(process.cwd(), ".next", "prerender-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    cachedPreviewModeId = manifest?.preview?.previewModeId ?? null;
  } catch {
    cachedPreviewModeId = null;
  }
  return cachedPreviewModeId ?? null;
}

export function proxy(request: NextRequest) {
  try {
    if (!request.cookies.has("STYXKEY_draft")) {
      return NextResponse.next();
    }
    const previewModeId = getPreviewModeId();
    if (!previewModeId) {
      return NextResponse.next();
    }
    if (request.cookies.get("__prerender_bypass")?.value === previewModeId) {
      return NextResponse.next();
    }
    const requestHeaders = new Headers(request.headers);
    const existing = requestHeaders.get("cookie") ?? "";
    requestHeaders.set(
      "cookie",
      existing ? `${existing}; __prerender_bypass=${previewModeId}` : `__prerender_bypass=${previewModeId}`,
    );
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};