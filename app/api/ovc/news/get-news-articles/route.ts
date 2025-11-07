import { NextRequest, NextResponse } from "next/server";
import { getNewsArticles } from "@/data/drupal/ovc-news";

export async function GET(request: NextRequest) {
  const page = Number.parseInt(request.nextUrl.searchParams.get("page") ?? "");
  const size = Number.parseInt(request.nextUrl.searchParams.get("size") ?? "20");

  if (isNaN(page)) {
    return new Response(JSON.stringify({ error: "Invalid page parameter. Must be a number." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await getNewsArticles(page, size);

  return NextResponse.json(data);
}
