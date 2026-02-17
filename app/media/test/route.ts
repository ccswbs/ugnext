import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  return Response.json({
    message: "Media API route is working",
    url: url.toString(),
    pathname: url.pathname,
    timestamp: new Date().toISOString()
  });
}