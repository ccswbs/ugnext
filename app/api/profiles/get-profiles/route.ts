import { NextRequest, NextResponse } from "next/server";
import { getFilteredProfiles } from "@/data/drupal/profile";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const page: number = Math.ceil(parseInt(params.get("page") ?? "0", 10));
  const pageSize: number = Math.ceil(parseInt(params.get("size") ?? "20", 10));
  const queryByName: string = params.get("queryByName") ?? "";
  const queryByResearchArea: string = params.get("queryByResearchArea") ?? "";
  const isAcceptingGraduateStudentsParam = params.get("isAcceptingGraduateStudents");
  const isAcceptingGraduateStudents =
    isAcceptingGraduateStudentsParam === "true" ? true : isAcceptingGraduateStudentsParam === "false" ? false : null;

  const units: string[] = (params.get("units") ?? "")
    .split(",")
    .map((unit) => unit.trim())
    .filter(Boolean);

  const types: string[] = (params.get("types") ?? "")
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);

  try {
    const data = await getFilteredProfiles({
      page,
      pageSize,
      queryByName,
      queryByResearchArea,
      units,
      types,
      isAcceptingGraduateStudents,
    });

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
