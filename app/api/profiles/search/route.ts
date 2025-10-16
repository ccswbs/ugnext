import { NextRequest, NextResponse } from "next/server";
import { getFilteredProfiles, VALID_PAGE_SIZES } from "@/data/drupal/profile";

export function getFilterOptions(url: string, ignorePage = false) {
  const params = new URL(url).searchParams;

  const page: number = Math.ceil(parseInt(params.get("page") ?? "0", 10));

  if (!ignorePage && (isNaN(page) || page < 0)) {
    throw new Error("Page must be a positive integer.");
  }

  const pageSize: number = Math.ceil(parseInt(params.get("size") ?? "20", 10));

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    throw new Error(`Page size must be one of the following: ${VALID_PAGE_SIZES.join(",")}`);
  }

  const query: string = params.get("query") ?? "";

  if (query.length > 128) {
    throw new Error("Query must not be longer than 128 characters.");
  }

  const units: string[] =
    (params.get("units") ?? "")
      ?.split(",")
      ?.map((unit) => unit.trim())
      ?.filter(Boolean) ?? null;

  const types: string[] =
    (params.get("types") ?? "")
      ?.split(",")
      ?.map((type) => type.trim())
      ?.filter(Boolean) ?? null;

  return { page, pageSize, query, units, types };
}

export async function GET(request: NextRequest) {
  let options;

  try {
    options = getFilterOptions(request.url);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  const { page, pageSize, query, units, types } = options;

  const data = await getFilteredProfiles({
    page,
    pageSize,
    searchQuery: query,
    units,
    types,
  });

  return NextResponse.json(data);
}
