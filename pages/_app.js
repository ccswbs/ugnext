import "@/styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Button } from "@/components/button";

function Application({ Component, pageProps }) {
  const gtmId =
    process.env.NODE_ENV === "production" && !pageProps?.isDraft
      ? process.env.NEXT_PUBLIC_GTM_ID
      : process.env.NEXT_PUBLIC_GTM_ID_DEV;

  return (
    <>
      {pageProps?.isDraft && (
        <div className="sticky left-0 top-0 z-20 flex h-fit w-full items-center justify-center gap-2 bg-uog-color-red p-2 text-center text-base font-bold text-white">
          <span>You are currently in Draft Mode.</span>

          <Button color="yellow" className="p-2" href="/api/disable-draft" prefetch={false}>
            Exit Draft Mode
          </Button>
        </div>
      )}
      <Component {...pageProps} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}

export default Application;
