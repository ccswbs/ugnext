import { twJoin, twMerge } from "tailwind-merge";
import { UnstyledLink } from "@/components/link";
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

export const Card = ({ href, image, title, footer, className, centered, children }) => {
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
        <div className="w-full overflow-hidden">
          <div
            className={twJoin(
              "[&>img]:object-cover",
              href &&
                "transition-transform duration-200 ease-in-out group-hover:scale-110 group-focus-visible:scale-105"
            )}
          >
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={href ? "" : image.alt}
              placeholder={image?.blurred ? "blur" : "empty"}
              blurDataURL={image?.blurred}
              sizes={image?.sizes}
              className={twMerge("object-cover", image?.className)}
            />
          </div>
        </div>
      )}

      {/* Card Main Container */}
      <div
        className={twJoin(
          "flex flex-1 flex-col gap-2 bg-light-blue-50 p-5",
          href && "transition-colors group-hover:bg-yellow"
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
            "flex gap-2 border-t border-t-blue-200 bg-light-blue-100 px-5 py-2 transition-colors",
            centered && "justify-center"
          )}
        >
          {footer}
        </div>
      )}
    </Tag>
  );
};

Card.propTypes = {
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
