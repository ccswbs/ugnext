import { Drupal } from "@/lib/drupal";

export default async function handler(req, res) {
  const response = await Drupal.validateDraftUrl(new URLSearchParams(req.query));

  // If validation fails, don't enable draft mode.
  if (!response.ok) {
    res.status(401);
    res.end("Invalid draft URL");
  }

  res.setDraftMode({ enable: true });
  res.end("Draft mode is enabled");
}
