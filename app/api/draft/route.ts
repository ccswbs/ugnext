import { drupal } from "@/lib/drupal";
import { enableDraftMode } from "next-drupal/draft";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response | never> {
  const searchParams = request.nextUrl.searchParams;
  console.log("Attempt to enable draft mode");
  console.log(searchParams.toString());

  // @ts-ignore
  return enableDraftMode(request, drupal);
}
