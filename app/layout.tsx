import React from "react";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { Metadata } from "next";
import AppArmor from "@/components/app-armor";

// Stylesheets
import "@/styles/globals.css";
import "@uoguelph/react-components/style";
import "@uoguelph/web-components/style";

export const metadata: Metadata = {
  metadataBase: new URL("https://uoguelph.ca"),
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId =
    process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_GTM_ID_DEV : process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full">
        <Script
          src="/@uoguelph/web-components/uofg-header.esm.js"
          type="module"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />

        <Script
          src="/@uoguelph/web-components/uofg-footer.esm.js"
          type="module"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />

        <Script src="https://kit.fontawesome.com/7993323d0c.js" crossOrigin="anonymous" strategy="lazyOnload" />

        <AppArmor />

        {children}
      </body>

      {/* Analytics */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </html>
  );
}
