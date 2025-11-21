import { getAllTypes } from "@/data/drupal/profile";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const types = await getAllTypes();
    return NextResponse.json(types);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}