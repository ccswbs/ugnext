import React from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/button";
import PropTypes from "prop-types";
import { YouTubeEmbed } from "@next/third-parties/google";

function getYouTubeVideoID(url) {
  if (!(url instanceof URL)) {
    return null;
  }

  if (url.searchParams.has("v")) {
    return url.searchParams.get("v");
  }

  const path = url.pathname.split("/")?.filter((token) => token !== "");

  switch (path?.[0]) {
    case "v":
    case "embed":
    case "watch":
    case "e":
    case "shorts":
    case "live":
      return path?.[1] ?? null;
    case "oembed":
      return getYouTubeVideoID(decodeURIComponent(url.searchParams.get("url")));
    case "attribution_link":
      // TODO: Handle attribution links
      return null;
    default:
      return path?.[0] ?? null;
  }
}

function getVimeoVideoID(url) {
  const path = url.pathname.split("/")?.filter((token) => token !== "");
  return path?.[0] ?? null;
}

function getVideoInfo(url) {
  const parsed = new URL(url);
  let type = null;
  let id = null;

  // Determine where the remote video is hosted (i.e. YouTube or Vimeo)
  if (parsed?.hostname.includes("youtube") || parsed?.hostname.includes("youtu.be")) {
    type = "youtube";
    id = getYouTubeVideoID(parsed);
  } else if (parsed?.hostname.includes("vimeo")) {
    type = "vimeo";
    id = getVimeoVideoID(parsed);
  }

  return { type: type, id: id };
}

export function EmbeddedVideo({ src, title, transcript, className, restrictRelated = false }) {
  const { id, type } = getVideoInfo(src);

  return (
    <div className={twMerge("flex flex-col", className)}>
      {type === "youtube" && id && (
        <YouTubeEmbed
          style="width: 100%; max-width: unset;"
          videoid={id}
          playlabel={title ?? "Youtube Embedded Video Player"}
          params={{
            rel: restrictRelated ? 0 : 1,
          }}
        />
      )}

      {type === "vimeo" && id && (
        <iframe
          className="w-full h-full"
          allowFullScreen
          src={`https://player.vimeo.com/video/${id}`}
          title={title ?? `Vimeo Embedded Video Player`}
        />
      )}

      {transcript && (
        <Button color="red" className="p-3 w-full" href={transcript} download={true}>
          Download Transcript
        </Button>
      )}
    </div>
  );
}

EmbeddedVideo.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  transcript: PropTypes.string,
  className: PropTypes.string,
  restrictRelated: PropTypes.bool, // Restrict related videos on YouTube to only videos from the same channel
};
