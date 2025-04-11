import { twJoin, twMerge } from "tailwind-merge";
import { UnstyledLink } from "@/components/link";
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

export const OVCNewsCard = ({ href, image, title, footer, className, centered, children }) => {
  const Tag = href ? UnstyledLink : "div";

  return (
    <Tag
      className={twMerge(
        "group flex flex-col justify-center transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-blue focus-visible:ring-offset-2",
        !image && href && "hover:scale-105 focus-visible:scale-105",
        className
      )}
      href={href}
    >
      {/* Card Image */}
      {image && (
        <div className="relative w-full overflow-hidden aspect-[9/4]">
          <div
            className={twJoin(
              "relative w-full h-full transition-transform duration-200 ease-in-out",
              href && "group-hover:scale-110 group-focus-visible:scale-105"
            )}
          >
            <Image
              src={image.src}
              alt={image.alt || "Image"}
              layout="fill" // Makes the image fill the parent container
              objectFit="cover" // Ensures the image covers the container
              objectPosition="center" // Centers the cropped area
              placeholder={image?.blurred ? "blur" : "empty"}
              blurDataURL={image?.blurred}
              className={twMerge("object-cover", image?.className)}
            />
          </div>
        </div>
      )}

      {/* Card Main Container */}
      <div
        className={twJoin(
          "flex flex-1 flex-col gap-2 bg-uog-color-grey-light-bg p-5",
          href && "transition-colors group-hover:bg-uog-color-yellow"
        )}
      >
        {/* Card Title */}
        <div className={twJoin("flex flex-1", centered && "items-center justify-center")}>
          {typeof title === "string" ? <span className="text-lg font-bold">{title}</span> : title}
        </div>

        {/* Card Body */}
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div
          className={twJoin(
            "flex gap-2 bg-uog-color-grey-light px-5 py-2 transition-colors",
            centered && "justify-center"
          )}
        >
          {footer}
        </div>
      )}
    </Tag>
  );
};

OVCNewsCard.propTypes = {
  href: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    alt: PropTypes.string.isRequired,
    blurred: PropTypes.string,
    className: PropTypes.string,
    sizes: PropTypes.string,
  }),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  centered: PropTypes.bool,
  children: PropTypes.node,
};
