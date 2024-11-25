import "@/styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Roboto, Roboto_Condensed } from "next/font/google";
import { useRouter } from "next/router";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  disabledFontFamilyHashing: true,
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
  disabledFontFamilyHashing: true,
});

function Application({ Component, pageProps }) {
  const { isPreview } = useRouter();
  const gtmId =
    process.env.NODE_ENV === "production" && !isPreview
      ? process.env.NEXT_PUBLIC_GTM_ID
      : process.env.NEXT_PUBLIC_GTM_ID_DEV;

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }

        uofg-header {
          font-family: ${robotoCondensed.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}

export default Application;
