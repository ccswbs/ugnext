"use client";

import Script from "next/script";
import React from "react";

export type WebComponentsLoaderProps = {
  cdn: "jsdelivr" | "unpkg";
  native: boolean;
};

export function WebComponentsLoader({ cdn, native }: WebComponentsLoaderProps) {
  let base = "";

  switch (cdn) {
    case "jsdelivr":
      base = "https://cdn.jsdelivr.net/npm/@uoguelph/web-components@2.x.x/dist/uofg-web-components";
      break;
    case "unpkg":
      base = "https://unpkg.com/@uoguelph/web-components@2.x.x/dist/uofg-web-components";
      break;
  }

  const Component = native ? "script" : Script;

  return (
    <>
      <Component src={`${base}/uofg-header.esm.js`} type="module" strategy="afterInteractive" />
      <Component src={`${base}/uofg-footer.esm.js`} type="module" strategy="afterInteractive" />
    </>
  );
}
