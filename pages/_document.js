import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const CDN_BASE = process.env.NEXT_PUBLIC_UOFG_WC_CDN_BASE_URL?.trim() || "https://cdn.jsdelivr.net/npm";
const UOFG_WEB_COMPONENTS_BASE = `@uoguelph/web-components@${process.env.NEXT_PUBLIC_UOFG_WC_VERSION?.trim() || "1.x.x"}/dist/uofg-web-components`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href={`${CDN_BASE}/${UOFG_WEB_COMPONENTS_BASE}/uofg-web-components.css`}
        />
        <Script
          src={`${CDN_BASE}/${UOFG_WEB_COMPONENTS_BASE}/uofg-header.esm.js`}
          type="module"
          strategy="beforeInteractive"
        />
        <Script
          src={`${CDN_BASE}/${UOFG_WEB_COMPONENTS_BASE}/uofg-footer.esm.js`}
          type="module"
          strategy="beforeInteractive"
        />
        <Script src="https://kit.fontawesome.com/7993323d0c.js" crossorigin="anonymous" strategy="lazyOnload" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
