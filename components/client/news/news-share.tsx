"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { useState } from "react";
import { Modal } from "@uoguelph/react-components/modal";
import { tv } from "tailwind-variants";
import { Typography } from "@uoguelph/react-components/typography";
import { faBluesky, faFacebookF, faLinkedin, faXTwitter } from "@awesome.me/kit-7993323d0c/icons/classic/brands";
import { faEnvelope } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { usePathname } from "next/navigation";

export function NewsShare({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const classes = tv({
    slots: {
      button: "inline-flex cursor-pointer items-center gap-1 pl-4 border-l-2 border-grey-light-focus",
      container: "flex flex-col gap-2 bg-white p-6 w-dvw max-w-fit",
      heading: "mt-0",
      buttons: "flex gap-2 flex-wrap",
      shareButton:
        "aspect-square border border-black  size-12 text-3xl text-black flex items-center justify-center transition-colors hocus:bg-red hocus:text-red-contrast",
    },
    variants: {
      socialMedia: {
        bluesky: {
          shareButton: "hocus:bg-facebook-blue hocus:text-white",
        },
        facebook: {
          shareButton: "hocus:bg-facebook-blue hover:text-white",
        },
        x: {
          shareButton: "hocus:bg-black hocus:text-white",
        },
        linkedin: {
          shareButton: "hocus:bg-linkedin-blue hocus:text-white",
        },
      },
    },
  })();

  return (
    <>
      <button onClick={() => setOpen(true)} className={classes.button()}>
        <FontAwesomeIcon icon={faShare} />
        Share
      </button>

      <Modal open={open} onClose={() => setOpen(false)} centered>
        <div className={classes.container()}>
          <Typography as="span" type="h2" className={classes.heading()}>
            Share this article
          </Typography>

          <div className={classes.buttons()}>
            <a
              href={`https://bsky.app/intent/compose?text=${title} ${pathname}`}
              className={classes.shareButton({ socialMedia: "bluesky" })}
            >
              <FontAwesomeIcon icon={faBluesky} />
              <span className="sr-only">Bluesky</span>
            </a>

            <a
              href={`http://www.facebook.com/sharer/sharer.php?u=${pathname}&title=${title}`}
              className={classes.shareButton({ socialMedia: "facebook" })}
            >
              <FontAwesomeIcon icon={faFacebookF} />
              <span className="sr-only">Facebook</span>
            </a>

            <a
              href={`http://www.linkedin.com/shareArticle?mini=true&url=${pathname}&title=${title}&source=${pathname}`}
              className={classes.shareButton({ socialMedia: "linkedin" })}
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span className="sr-only">LinkedIn</span>
            </a>

            <a
              href={`https://x.com/intent/tweet?original_referer=${pathname}&text=${title}&url=${pathname}`}
              className={classes.shareButton({ socialMedia: "x" })}
            >
              <FontAwesomeIcon icon={faXTwitter} />
              <span className="sr-only">X</span>
            </a>

            <a
              href={`mailto:?subject=${title}&body=Check out this U of G article I came across ${pathname}`}
              className={classes.shareButton()}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
