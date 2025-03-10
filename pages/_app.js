import "@/styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { useRouter } from "next/router";

function Application({ Component, pageProps }) {
  const { isPreview } = useRouter();
  const gtmId =
    process.env.NODE_ENV === "production" && !isPreview
      ? process.env.NEXT_PUBLIC_GTM_ID
      : process.env.NEXT_PUBLIC_GTM_ID_DEV;

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap");
      `}</style>
      <Component {...pageProps} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}

export default Application;
