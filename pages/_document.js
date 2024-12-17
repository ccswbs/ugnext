import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@uoguelph/web-components@1.x.x/dist/uofg-web-components/uofg-web-components.css"
        />
        <Script
          src="https://unpkg.com/@uoguelph/web-components@1.x.x/dist/uofg-web-components/uofg-header.esm.js"
          type="module"
          strategy="beforeInteractive"
        />
        <Script
          src="https://unpkg.com/@uoguelph/web-components@1.x.x/dist/uofg-web-components/uofg-footer.esm.js"
          type="module"
          strategy="beforeInteractive"
        />
        <Script src="https://kit.fontawesome.com/7993323d0c.js" crossorigin="anonymous" strategy="lazyOnload" />

        <Script id="header-height-css-variable" strategy="afterInteractive">
          {`
            const updateVariable = () => {
              const header = document.querySelector('uofg-header');              
              document.body.style.setProperty('--header-height', header.clientHeight + 'px');
            }
            
            window.addEventListener('resize', updateVariable, { passive: true });
            
            window.addEventListener('load', () => {
              const header = document.querySelector('uofg-header');              
              document.body.style.setProperty('--header-height', header.clientHeight + 'px');
            });
          `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
