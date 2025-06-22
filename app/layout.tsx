import React from "react";
import Head from "next/head";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { isDraft } from "@/lib/is-draft";
import { Metadata } from "next";

// Stylesheets
import "@/styles/globals.css";
import "@uoguelph/react-components/style";

export const metadata: Metadata = {
  title: {
    template: "%s | University of Guelph",
    default: "University of Guelph - Improve Life",
  },
  description:
    "Discover excellence at the University of Guelph - a leading institution fostering innovation, world-class research, and personalized learning. Explore our diverse academic programs, cutting-edge facilities, and vibrant campus life. Join a community dedicated to shaping the future.",
  twitter: {
    card: "summary_large_image",
    creator: "@uofg",
  },
};

function getUofGWebComponentsCdnUrl() {
  const defaultCDN = "https://cdn.jsdelivr.net/npm";
  let url = process.env.NEXT_PUBLIC_UOFG_WC_CDN_BASE_URL?.trim?.() ?? defaultCDN;

  if (!URL.canParse(url)) {
    url = defaultCDN;
  }

  let version = process.env.NEXT_PUBLIC_UOFG_WC_VERSION?.trim?.() ?? "2.x.x";

  if (!/^(\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?|rc|latest)$/.test(version)) {
    version = "2.x.x";
  }

  url += `/@uoguelph/web-components@${version}/dist/uofg-web-components`;

  return url;
}

function getGoogleTagManagerId(draft: boolean) {
  if (draft) {
    return process.env.NEXT_PUBLIC_GTM_ID_DEV ?? "";
  }

  return process.env.NEXT_PUBLIC_GTM_ID ?? "";
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = await isDraft();
  const webComponentsCdn = getUofGWebComponentsCdnUrl();
  const gtmId = getGoogleTagManagerId(isDraftMode);

  return (
    <html lang="en">
      {/* Load web components style from the CDN */}
      <link rel="stylesheet" href={`${webComponentsCdn}/uofg-web-components.css`} />

      <body>{children}</body>

      {/* Load web components scripts from the CDN */}
      <Script src={`${webComponentsCdn}/uofg-header.esm.js`} type="module" strategy="beforeInteractive" />
      <Script src={`${webComponentsCdn}/uofg-footer.esm.js`} type="module" strategy="beforeInteractive" />

      {/* Load Font Awesome */}
      <Script src="https://kit.fontawesome.com/7993323d0c.js" crossOrigin="anonymous" strategy="lazyOnload" />

      {/* Analytics */}
      <GoogleTagManager gtmId={gtmId} />
    </html>
  );
}
