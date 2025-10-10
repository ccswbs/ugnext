import { NextRequest, NextResponse } from "next/server";
import { getProfilesByUnitPaginated } from "@/data/drupal/profile";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    
    if (!unitId) {
      return NextResponse.json(
        { error: 'Unit ID is required' }, 
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const searchTerm = searchParams.get('search') || undefined;

    const result = await getProfilesByUnitPaginated(unitId, page, pageSize, searchTerm);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in profiles/unit API:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles for unit' }, 
      { status: 500 }
    );
  }
}