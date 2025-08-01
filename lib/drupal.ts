import { NextDrupal } from "next-drupal";

export const drupal = new NextDrupal((process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string).replace(/\/$/, ""), {
  headers: {
    "api-key": process.env.DRUPAL_API_KEY ?? "",
  },
  debug: process.env.NODE_ENV === "development",
});
