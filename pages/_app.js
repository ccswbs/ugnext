import "@/styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Bitter, DM_Sans, Roboto, Roboto_Condensed } from "next/font/google";
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

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
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
        
        :root {
        --bitter-font: ${bitter.style.fontFamily};
        --dmSans-font: ${dmSans.style.fontFamily};
        --uog-color-black: #000000;
        --uog-color-black-hover: #353636;
        --uog-color-red: #E51937;
        --uog-color-red-hover: #BD2E35;
        --uog-color-yellow: #FFC429;
        --uog-color-yellow-hover: #FFE299;
        --uog-color-blue: #187BB4;
        --uog-color-blue-hover: #156B9D;
        --uog-color-green: #318738;
        --uog-color-green-hover: #2A7430;
        --uog-color-light-gray: #DADCD4;
        --uog-color-light-gray-hover: #BFBFBF;
        --uog-color-dark-gray: #787673;
        --uog-color-dark-gray-hover: #686764;

      `}</style>

      <Component {...pageProps} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}

export default Application;
