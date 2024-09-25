import { Drupal } from "@/lib/drupal";

export default async function handler(request, response) {
  request.query.timestamp ??= Date.now().toString();

  return await Drupal.preview(request, response);
}
