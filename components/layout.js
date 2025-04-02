import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import { Transition } from "@headlessui/react";
import { faSpinner } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";
import AppArmor from "@/components/app-armor";

export const Layout = ({ children, className, metadata, header, footer, forceAppArmorTest = false }) => {
  const { isPreview, isFallback } = useRouter();

  const title = metadata?.title ? `${metadata.title} | University of Guelph` : "University of Guelph - Improve Life";

  const description =
    metadata?.description ??
    "Discover excellence at the University of Guelph - a leading institution fostering innovation, world-class research, and personalized learning. Explore our diverse academic programs, cutting-edge facilities, and vibrant campus life. Join a community dedicated to shaping the future.";

  const socialImage = metadata?.image ?? {
    src: "https://www.uoguelph.ca/img/ug-social-thumb.jpg",
    alt: "University of Guelph logo",
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={socialImage.src} />
        <meta property="og:image:alt" content={socialImage.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@uofg" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content={socialImage.src} />
        <meta name="twitter:image:alt" content={socialImage.alt} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Transition show={isFallback}>
        <div className="fixed left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center gap-6 bg-white text-uog-color-red transition-opacity duration-300 data-[closed]:opacity-0">
          <FontAwesomeIcon className="text-9xl" icon={faGryphonStatue} />

          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="w-[1.5em] animate-spin" icon={faSpinner} />
            <span className="font-condensed text-3xl">Loading</span>
          </div>
        </div>
      </Transition>

      {!isFallback && (
        <>
          <AppArmor testing={forceAppArmorTest || isPreview} />

          <a
            className="sr-only focus:not-sr-only fixed top-0 left-0 z-[1000] !w-fit bg-uog-color-yellow underline px-0 focus:px-2 transition-[padding]"
            href="#content"
          >
            Skip to main content
          </a>

          <div className="flex flex-1 flex-col">
            {isPreview && (
              <div className="sticky left-0 top-0 z-20 flex h-fit w-full items-center justify-center gap-2 bg-uog-color-red p-2 text-center text-base font-bold text-white">
                <span>You are currently in Preview Mode.</span>

                <Button color="yellow" className="p-2" href="/api/exit-preview">
                  Exit Preview Mode
                </Button>
              </div>
            )}

            {header !== false && (
              <Header topic={header?.topic} navigation={header?.navigation} variant={header?.variant} />
            )}

            <main id="content" className={twMerge("flex-1", className)}>
              {children}
            </main>

            {footer !== false && <Footer links={footer?.links} variant={footer?.variant} />}
          </div>
        </>
      )}
    </>
  );
};

const itemType = {
  title: PropTypes.string,
  url: PropTypes.string,
};

itemType.children = PropTypes.arrayOf(PropTypes.shape(itemType));

Layout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  metadata: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    socialImage: PropTypes.shape({
      src: PropTypes.string,
      alt: PropTypes.string,
    }),
  }),
  header: PropTypes.oneOfType([PropTypes.shape({ ...Header.propTypes }), PropTypes.bool]),
  footer: PropTypes.oneOfType([PropTypes.shape({ ...Footer.propTypes }), PropTypes.bool]),
  forceAppArmorTest: PropTypes.bool
};
