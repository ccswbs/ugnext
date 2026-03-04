import { NextRequest, NextResponse } from "next/server";
import { getAllNewsCategories } from "@/data/drupal/news";

export async function GET(request: NextRequest) {
  const categories = await getAllNewsCategories();

  if (!categories) {
    return NextResponse.json(
      {
        error: "Failed to fetch news categories.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    return NextResponse.json(categories);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
