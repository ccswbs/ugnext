import React from "react";
import Image from "next/image";

/**
 * Renders a figure tag styled like a card.
 * Converts alignment classes to Tailwind equivalents.
 * @param {Object} props - The properties for the figure card.
 * @param {string} props.src - The image source URL.
 * @param {string} props.alt - The alt text for the image.
 * @param {string} props.caption - The caption text.
 * @param {string} props.align - The alignment class (e.g., "align-left" or "align-right").
 * @param {string} props.className - Additional classes for the figure.
 * @returns {JSX.Element} The rendered figure card.
 */
export const FigureCard = ({ src, alt, width, height,  caption, align, className }) => {
  // Convert alignment classes to Tailwind equivalents
  let alignmentClass = "my-4"; // Default margin for figures
  if (align === "align-left") {
    alignmentClass = "float-left mr-4";
  } else if (align === "align-right") {
    alignmentClass = "float-right ml-4";
  }

  return (
    <figure
      className={`group flex flex-col justify-center bg-uog-color-grey-light-bg p-5 max-w-fit ${alignmentClass} ${className}`}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-full transition-transform duration-200 ease-in-out">
          <Image
            src={src}
            width={width}
            height={height}
            alt={alt || "Image"}
            fill
            placeholder="empty"
            className="object-cover"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};