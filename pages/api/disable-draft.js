import { disableDraftMode } from "next-drupal/draft"

export async function GET(request) {
  return disableDraftMode()
}