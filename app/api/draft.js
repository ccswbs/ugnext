import { drupal } from "@/lib/drupal"
import { enableDraftMode } from "next-drupal/draft"

export async function GET(request) {
  return enableDraftMode(request, drupal)
}