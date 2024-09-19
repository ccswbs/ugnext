import React from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/button";
import PropTypes from "prop-types";
import { YouTubeEmbed } from "@next/third-parties/google";

const getVideoInfo = (url) => {
  if (!url) {
    return { type: null, id: null };
  }

  const regex =
    /^((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/|user\/[A-Za-z0-9]+#p\/u\/\d\/)|youtu\.be\/)|(?:https?:\/\/)?(?:www\.)?vimeo\.com\/)([A-Za-z0-9\-_]+)/;

  const match = url.match(regex);

  if (match) {
    const type = match[1].includes("youtube") || match[1].includes("youtu.be") ? "youtube" : "vimeo";
    const id = match[2];

    return { type: type, id: id };
  }

  return { type: null, id: null };
};

export function EmbeddedVideo({ url, title, transcript, className }) {
  const { id, type } = getVideoInfo(url);

  return (
    <div className={twMerge("flex flex-col", className)}>
      {type === "youtube" && id && (
        <YouTubeEmbed
          style="width: 100%; max-width: unset;"
          videoid={id}
          playlabel={title ?? "Youtube Embedded Video Player"}
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
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  transcript: PropTypes.string,
  className: PropTypes.string,
};
