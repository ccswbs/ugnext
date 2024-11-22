import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script src="/uofg-web-components/uofg-header.esm.js" type="module" strategy="beforeInteractive" />
        <Script src="/uofg-web-components/uofg-footer.esm.js" type="module" strategy="beforeInteractive" />
        <Script src="https://kit.fontawesome.com/7993323d0c.js" crossorigin="anonymous" strategy="lazyOnload" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
