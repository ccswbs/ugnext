import { NextResponse } from "next/server";
import { getAllEventCategories } from "@/data/drupal/events";

export async function GET() {
  try {
    return NextResponse.json(await getAllEventCategories());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
