import { draftMode } from "next/headers";

export async function showUnpublishedContent() {
  if ((await draftMode()).isEnabled) {
    return true;
  }

  if (process.env.ALWAYS_SHOW_PUBLISHED_CONTENT === "true") {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return null;
}
