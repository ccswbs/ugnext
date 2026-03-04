import { NextRequest, NextResponse } from "next/server";
import { getFilteredNews } from "@/data/drupal/news";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const page: number = Math.ceil(parseInt(params.get("page") ?? "0", 10));
  const pageSize: number = Math.ceil(parseInt(params.get("size") ?? "20", 10));
  const query: string = params.get("query") ?? "";

  const units: string[] = (params.get("units") ?? "")
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);

  const categories: string[] = (params.get("categories") ?? "")
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);

  try {
    const data = await getFilteredNews({
      page,
      pageSize,
      units,
      query,
      categories,
    });

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
