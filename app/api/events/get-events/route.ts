import { NextRequest, NextResponse } from "next/server";
import { getFilteredEvents } from "@/data/drupal/events";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const page: number = Math.ceil(parseInt(params.get("page") ?? "0", 10));
  const pageSize: number = Math.ceil(parseInt(params.get("size") ?? "20", 10));
  const query: string = params.get("query") ?? "";

  try {
    const data = await getFilteredEvents({
      page,
      pageSize,
      query,
    });

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
