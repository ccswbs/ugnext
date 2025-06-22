import { draftMode } from "next/headers";

export async function isDraft() {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return (await draftMode()).isEnabled;
}
