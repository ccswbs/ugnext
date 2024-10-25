import PropTypes from "prop-types";
import { twJoin, twMerge } from "tailwind-merge";
import Image from "next/image";
import React from "react";
import { EmbeddedVideo } from "@/components/embedded-video";

export const MediaCaption = ({ media, size = "small", position = "left", background = "none", className, children }) => {
  const type = media?.src && media?.alt ? "image" : "video";

  // Small video doesn't work well, so we'll bump it up to medium
  size = type === "video" && size === "small" ? "medium" : size;

  return (
    <div
      className={twMerge(
        "flex flex-col",
        position === "left" &&
          twJoin(
            "md:grid",
            size === "small" && "grid-cols-[1fr,4fr]",
            size === "medium" && "grid-cols-[1fr,2fr]",
            size === "large" && "grid-cols-[1fr,1fr]"
          ),
        position === "right" &&
          twJoin(
            "md:grid",
            size === "small" && "grid-cols-[4fr,1fr]",
            size === "medium" && "grid-cols-[2fr,1fr]",
            size === "large" && "grid-cols-[1fr,1fr]"
          ),
        className
      )}
    >
      <div className={twJoin(position === "right" && "col-start-2 row-start-1")}>
        {/* Media is an image */}
        {media?.src && media?.alt && (
          <Image
            src={media.src}
            width={media.width}
            height={media.height}
            alt={media.alt}
            placeholder={media.blurred ? "blur" : "empty"}
            blurDataURL={media.blurred}
            className={twMerge("object-cover w-full", media?.className)}
          />
        )}

        {/* Media is a video */}
        {media?.src && media?.title && (
          <EmbeddedVideo src={media.src} title={media.title} transcript={media.transcript} restrictRelated={true} />
        )}
      </div>

      <div
        className={twMerge(
          "p-4",
          position === "right" && "col-start-1 row-start-1",
          background === "light-blue" && "bg-light-blue-50",
          background === "dark-grey" && "bg-cool-grey-950 text-white",
          background === "none" && position === "left" && "py-0 md:px-4",
          background === "none" && position === "right" && "py-0 md:px-4",
          background === "none" && position === "above" && "px-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

MediaCaption.propTypes = {
  /**
   * The media to display. Can be an image or a video
   */
  media: PropTypes.oneOfType([
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      height: PropTypes.number,
      width: PropTypes.number,
      alt: PropTypes.string.isRequired,
      className: PropTypes.string,
      blurred: PropTypes.string,
    }),
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      transcript: PropTypes.string,
      title: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  /**
   * Only applicable when position is "left" or "right". When media is a video, the size is bumped up to "medium" if "small" is selected.
   */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /**
   * The position of the media relative to the caption.
   */
  position: PropTypes.oneOf(["left", "right", "above"]),
  /**
   * The background colour of the caption area.
   */
  background: PropTypes.oneOf(["none", "light-blue", "dark-grey"]),
  className: PropTypes.string,
  children: PropTypes.node,
};
