"use client";

import { tv } from "tailwind-variants";
import { Typography } from "@uoguelph/react-components/typography";
import { NewsFragment } from "@/lib/graphql/types";
import { useEffect, useState } from "react";
import { Button } from "@uoguelph/react-components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedinIn, faXTwitter } from "@awesome.me/kit-7993323d0c/icons/classic/brands";
import { faShare } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export type NewsSidebarProps = {
  data: NewsFragment;
};

export function NewsSidebar({ data }: NewsSidebarProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const sidebar = tv({
    slots: {
      base: "flex flex-col gap-6",
      buttons: "flex flex-row gap-2 flex-wrap w-full",
      button: "p-3 text-xl",
      info: "flex flex-col gap-1 *:m-0",
    },
  });

  const { base, buttons, button, info } = sidebar();

  let directory: string;

  if (
    data.primaryNavigation &&
    data.primaryNavigation.newsUrlAliasPattern &&
    data.primaryNavigation.menuName !== "no-menu"
  ) {
    directory = `/news${data.primaryNavigation.newsUrlAliasPattern}`;
  } else {
    directory = "/news";
  }

  return (
    <div className={base()}>
      <Typography type="h3" as="span" className="m-0">
        Share This Page
      </Typography>

      <div className={buttons()}>
        <Button
          className={button()}
          outlined={true}
          color="secondary"
          as="a"
          href={`https://twitter.com/intent/tweet?original_referer=${url}&text=${data.title}&url=${url}`}
        >
          <FontAwesomeIcon icon={faXTwitter} />
          <span className="sr-only">Share on X</span>
        </Button>

        <Button
          className={button()}
          outlined={true}
          color="secondary"
          as="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        >
          <FontAwesomeIcon icon={faFacebook} />
          <span className="sr-only">Share on Facebook</span>
        </Button>

        <Button
          className={button()}
          outlined={true}
          color="secondary"
          as="a"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
          <span className="sr-only">Share on LinkedIn</span>
        </Button>

        <Button
          className={button()}
          outlined={true}
          color="secondary"
          as="a"
          href={`mailto:?subject=${data.title}&body=${url}`}
        >
          <FontAwesomeIcon icon={faShare} />
          <span className="sr-only">Share via Email</span>
        </Button>
      </div>

      <div className={info()}>
        {data.author && (
          <Typography type="body" as="span">
            <strong>Authored By:</strong> {data.author}
          </Typography>
        )}

        <Typography type="body" as="span">
          <strong>Published on:</strong>{" "}
          {new Date(data.datePublished.time).toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Typography>

        {data.dateUpdated && (
          <Typography type="body" as="span">
            <strong>Updated on:</strong>{" "}
            {new Date(data.dateUpdated.time).toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Typography>
        )}

        {data.hero?.image && (
          <Typography type="body" as="span">
            <strong>Lead Image:</strong> {data.hero.image.alt}
          </Typography>
        )}
      </div>

      {data.category && data.category.length > 0 && (
        <>
          <Typography type="h4" as="span" className="m-0">
            Filed under
          </Typography>

          <div className={buttons()}>
            {data.category.map((category) => (
              <Button
                className={twMerge(button(), "text-base")}
                href={`${directory}?categories=${category.id}`}
                key={category.id}
                color="secondary"
                as={Link}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
