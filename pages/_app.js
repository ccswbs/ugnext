import "@/styles/globals.css";
import "@uoguelph/react-components/style";
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
      <Component {...pageProps} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}

export default Application;
