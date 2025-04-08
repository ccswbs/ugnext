import Script from "next/script";
import Head from "next/head";
import { draftMode } from "next/headers";
import Link from "next/link";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraft } = await draftMode();
  const CDN_BASE = process.env.NEXT_PUBLIC_UOFG_WC_CDN_BASE_URL?.trim() || "https://cdn.jsdelivr.net/npm";
  const UOFG_WEB_COMPONENTS_BASE = `@uoguelph/web-components@${process.env.NEXT_PUBLIC_UOFG_WC_VERSION?.trim() || "2.x.x"}/dist/uofg-web-components`;

  return (
    <html lang="en">
      <Head>
        <link rel="stylesheet" href={`${CDN_BASE}/${UOFG_WEB_COMPONENTS_BASE}/uofg-web-components.css`} />
      </Head>

      <body>
        <Script
          src={`${CDN_BASE}/${UOFG_WEB_COMPONENTS_BASE}/uofg-header.esm.js`}
          type="module"
          strategy="beforeInteractive"
          async
        />

        <Script
          src={`${CDN_BASE}/${UOFG_WEB_COMPONENTS_BASE}/uofg-footer.esm.js`}
          type="module"
          strategy="beforeInteractive"
          async
        />

        <Script src="https://kit.fontawesome.com/7993323d0c.js" strategy="lazyOnload" async />
        {isDraft && (
          <div className="sticky left-0 top-0 z-20 flex h-fit w-full items-center justify-center gap-2 bg-uog-color-red p-2 text-center text-base font-bold text-white">
            <span>You are currently in Draft Mode.</span>

            <Link className="p-2" href="/api/disable-draft" prefetch={false}>
              Exit Draft Mode
            </Link>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
