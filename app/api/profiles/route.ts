import { NextRequest, NextResponse } from "next/server";
import { getProfilesPaginated } from "@/data/drupal/profile";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const searchTerm = searchParams.get('search') || undefined;
    
    const result = await getProfilesPaginated(page, pageSize, searchTerm);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in profiles API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' }, 
      { status: 500 }
    );
  }
}