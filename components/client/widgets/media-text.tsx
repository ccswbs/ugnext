import { Typography, TypographyProps } from "@uoguelph/react-components/typography";
import { HtmlParser } from "@/components/client/html-parser";
import { ButtonSectionWidget } from "@/components/client/widgets/button-section";
import { MediaCaption, MediaCaptionProps } from "@uoguelph/react-components/media-caption";
import { useContext } from "react";
import { SectionContext, SectionContextValue } from "@/components/client/section";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { EmbeddedVideo } from "@uoguelph/react-components/embedded-video";
import type { MediaTextFragment } from "@/lib/graphql/types";

const getBackground = (data: MediaTextFragment) => {
  switch (data.background?.name) {
    case "Light Blue":
      return "grey-light";
    case "Dark Gray":
      return "grey-dark";
    default:
      return "none";
  }
};

const getSize = (data: MediaTextFragment) => {
  if (data.mediaImageSize) {
    return data.mediaImageSize as NonNullable<MediaCaptionProps["size"]>;
  }

  return "large";
};

const getMedia = (data: MediaTextFragment) => {
  switch (data.media?.__typename) {
    case "MediaImage":
      return {
        __typename: "image",
        src: data.media?.image?.url,
        width: data.media?.image?.width,
        height: data.media?.image?.height,
        alt: data.media?.image?.alt,
      };
    case "MediaRemoteVideo":
      return {
        __typename: "video",
        src: data.media?.url,
        title: data.media?.name,
        transcript: data.media?.transcript,
      };
  }
};

const getPosition = (data: MediaTextFragment, column?: SectionContextValue["column"]) => {
  switch (column) {
    case "primary":
      // For MediaRemoteVideo, always return "above" in primary column
      if (data.media?.__typename === "MediaRemoteVideo") {
        return "above";
      }
      switch (data.mediaImageSize) {
        case "small":
        case "medium":
          return "left";
        default:
          return "above";
      }
    case "secondary":
      return "above";
    default:
      return (data.mediaAlignment as MediaCaptionProps["position"]) ?? "left";
  }
};

export function MediaTextWidget({ data }: { data: MediaTextFragment }) {
  const context = useContext(SectionContext);
  const background = getBackground(data);
  const size = getSize(data);
  const media = getMedia(data);
  const position = getPosition(data, context?.column);

  const classes = tv({
    slots: {
      base: "col-span-1 h-full w-full",
      heading: "mt-0!",
      body: "",
      no_body: "grid-cols-1 h-auto",
    },
    variants: {
      background: {
        none: "",
        "grey-light": "",
        "grey-dark": {
          heading: "text-body-copy-bold-on-dark",
          body: "",
        },
      },
    },
  })({ background: background });

  // Early return if no media
  if (!media) {
    return null;
  }

  // Determine if we have any content to show
  const hasContent = !!(data.heading || data.description?.processed || data.buttonSection);

  // If no content, render just the media element directly
  if (!hasContent) {
    const MediaComponent = media.__typename === "image" ? Image : EmbeddedVideo;
    
    // For small images with no content, render at original dimensions with no classes
    const isSmallImage = media.__typename === "image" && size === "small";
    
    const mediaProps = {
      id: `media-and-text-${data.uuid}`,
      src: media.src,
      height: media?.height,
      width: media?.width,
      alt: data.mediaIsDecorative ? "" : (media?.alt ?? ""),
      ...(isSmallImage ? {} : { className: twMerge("w-full object-cover", classes.base()) }),
      ...(media.__typename === "video" && { 
        title: media.title,
        transcript: media?.transcript?.url 
      }),
    };

    return <MediaComponent {...mediaProps} />;
  }

  // Otherwise, render the full MediaCaption layout
  const mediaCaptionProps = {
    id: `media-and-text-${data.uuid}`,
    src: media.src,
    height: media?.height,
    width: media?.width,
    alt: data.mediaIsDecorative ? "" : (media?.alt ?? ""),
    as: media.__typename === "image" ? Image : EmbeddedVideo,
    background,
    size,
    position,
    className: twMerge(classes.base(), data.description ? null : classes.no_body()),
    transcript: media?.transcript?.url,
  } as const;

  return (
    <MediaCaption {...mediaCaptionProps}>
      {data.heading && (
        <Typography
          id={`media-and-text-heading-${data.uuid}`}
          className={classes.heading()}
          type={(data?.headingLevel as TypographyProps<"span">["type"]) ?? "h3"}
          as={(data?.headingLevel as TypographyProps<"span">["as"]) ?? "h3"}
        >
          {data.heading}
        </Typography>
      )}

      {data.description?.processed && (
        <div className={classes.body()}>
          <HtmlParser html={data.description?.processed ?? ""} />
        </div>
      )}

      {data.buttonSection && <ButtonSectionWidget data={data.buttonSection} />}
    </MediaCaption>
  );
}