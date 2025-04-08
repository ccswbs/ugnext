import { Drupal } from "@/lib/drupal";

export default function handler(req, res) {
  const response = Drupal.validateDraftUrl(req.nextUrl.searchParams);

  // If validation fails, don't enable draft mode.
  if (!response.ok) {
    return response;
  }

  res.setDraftMode({ enable: true });
  res.end("Draft mode is enabled");
}
