import { NextRequest } from "next/server";
import { getMediaPathById } from "@/data/drupal/media";

function convertToRelativePath(absoluteUrl: string): string {
  try {
    const url = new URL(absoluteUrl);
    const pathMatch = url.pathname.match(/(\\/sites\\/default\\/files\\/.*)$/);
    if (pathMatch) {
      return pathMatch[1];
    }
    return url.pathname;
  } catch {
    return absoluteUrl;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing media ID" }, { status: 400 });
  }

  try {
    const originalPath = await getMediaPathById(id);
    
    if (!originalPath) {
      return Response.json({ error: "Media not found" }, { status: 404 });
    }

    const relativePath = convertToRelativePath(originalPath);
    
    return Response.json({
      success: true,
      mediaId: id,
      originalPath,
      relativePath,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        drupalBaseUrl: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
        nextStaticOutput: process.env.NEXT_STATIC_OUTPUT,
      }
    });
  } catch (error) {
    return Response.json({ 
      error: "Failed to fetch media", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}