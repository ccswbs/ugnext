import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";
import { UnstyledLink } from "@/components/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCircleXmark } from "@awesome.me/kit-7993323d0c/icons/classic/regular";

const Notification = ({ title, url, color, className }) => {
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {!dismissed && (
        <div
          className={twMerge(
            "sticky w-full flex gap-1 justify-center h-fit font-condensed items-center top-0 left-0 py-3 md:py-2 z-50 overflow-x-hidden px-[max(calc((100%-1320px)/2),theme(spacing.3))]",
            color === "red" && "bg-red text-white",
            color === "yellow" && "bg-yellow text-black",
            color === "blue" && "bg-light-blue text-black",
            color === "grey" && "bg-grey text-black",
            className
          )}
        >
          <UnstyledLink href={url} className="flex justify-center items-center ml-auto gap-[0.25em]">
            <FontAwesomeIcon className="text-[1.25em]" icon={faTriangleExclamation} />
            <span>{title}</span>
            <span>{url?.replace(/https?:\/\//, "")}</span>
          </UnstyledLink>

          <button
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
          >
            <FontAwesomeIcon className="text-[1.5em]" icon={faCircleXmark} />
            <span className="sr-only">Dismiss Notification</span>
          </button>
        </div>
      )}
    </>
  );
};

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["red", "yellow", "blue", "grey"]),
};

export default Notification;
