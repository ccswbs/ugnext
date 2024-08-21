import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import GoogleTagManager from '@magicul/next-google-tag-manager';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />

        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />

        <link
          href="https://cdn.jsdelivr.net/npm/@uoguelph/web-components@1.x.x/dist/uofg-web-components/uofg-web-components.css"
          rel="stylesheet"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/@uoguelph/web-components@1.x.x/dist/uofg-web-components/uofg-header.esm.js"
          type="module"
          strategy="beforeInteractive"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/@uoguelph/web-components@1.x.x/dist/uofg-web-components/uofg-footer.esm.js"
          type="module"
          strategy="beforeInteractive"
        />

        <Script src="https://kit.fontawesome.com/7993323d0c.js" crossorigin="anonymous" strategy="lazyOnload" />
      </Head>
      <body>
        {process.env.NODE_ENV === 'production' && <GoogleTagManager id={process.env.GTM_ID} />}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
