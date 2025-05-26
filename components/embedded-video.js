import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button, ButtonColors } from "@/components/button";
import PropTypes from "prop-types";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Modal } from "@/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@awesome.me/kit-7993323d0c/icons/classic/solid";

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
  let type = null;
  let id = null;

  try {
    const parsed = new URL(url);

    // Determine where the remote video is hosted (i.e. YouTube or Vimeo)
    if (parsed?.hostname.includes("youtube") || parsed?.hostname.includes("youtu.be")) {
      type = "youtube";
      id = getYouTubeVideoID(parsed);
    } else if (parsed?.hostname.includes("vimeo")) {
      type = "vimeo";
      id = getVimeoVideoID(parsed);
    }
  } catch (e) {
    // Do nothing
  }

  return { type: type, id: id };
}

function Video({ src, title, transcript, className, options }) {
  const { id, type } = getVideoInfo(src);

  return (
    <div className={twMerge("flex flex-col", className)}>
      {type === "youtube" && id && (
        <YouTubeEmbed
          style="width: 100%; max-width: unset;"
          videoid={id}
          playlabel={title ?? "Youtube Embedded Video Player"}
          params={{
            rel: options?.restrictRelated ? 0 : 1,
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

export function EmbeddedVideo({ src, title, transcript, className, options, modal }) {
  const [modalOpen, setModalOpen] = useState(false);

  return modal ? (
    <>
      {modal.type === "play-button" ? (
        <button
          className={twMerge(
            "rounded-full transition-colors w-24 text-4xl flex items-center justify-center aspect-square text-white bg-black/30 hover:bg-red/30 focus:bg-red/30",
            modal.className
          )}
          onClick={() => setModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlay} />
          <span className="sr-only">Show Video</span>
        </button>
      ) : (
        <Button color={modal.type} onClick={() => setModalOpen(true)} className={modal.className}>
          {modal.button}
        </Button>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col gap-4 p-4 bg-zinc-900 w-fit text-white">
          <span className="text-xl">{title}</span>

          <Video
            src={src}
            title={title}
            transcript={transcript}
            className={twMerge("max-w-2xl w-[calc(100vw-(--spacing(4)))]", className)}
            options={options}
          />
        </div>
      </Modal>
    </>
  ) : (
    <Video src={src} title={title} transcript={transcript} className={className} options={options} />
  );
}

EmbeddedVideo.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  transcript: PropTypes.string,
  className: PropTypes.string,
  restrictRelated: PropTypes.bool,
  options: PropTypes.shape({
    restrictRelated: PropTypes.bool, // Restrict related videos on YouTube to only videos from the same channel
  }),
  modal: PropTypes.shape({
    button: PropTypes.node,
    type: PropTypes.oneOf([...ButtonColors, "play-button"]).isRequired,
    className: PropTypes.string,
  }),
};
