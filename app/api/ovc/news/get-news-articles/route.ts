import { NextRequest } from "next/server";
import { getNewsArticles } from "@/data/drupal/ovc/news";

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get("page");
  const page = pageParam !== null ? Number(pageParam) : NaN;

  if (isNaN(page)) {
    return new Response(JSON.stringify({ error: "Invalid page parameter. Must be a number." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const articles = await getNewsArticles(page);

  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
