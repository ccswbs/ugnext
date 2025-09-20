import { Typography } from "@uoguelph/react-components/typography";
import { HtmlParser } from "@/components/client/html-parser";
import { ButtonSectionWidget } from "@/components/client/widgets/button-section";
import { MediaCaption } from "@uoguelph/react-components/media-caption";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import { tv } from "tailwind-variants";
import Image from "next/image";
import { EmbeddedVideo } from "@uoguelph/react-components/embedded-video";

const getBackground = (data) => {
  switch (data?.background?.name) {
    case "Light Blue":
      return "grey-light";
    case "Dark Gray":
      return "grey-dark";
    default:
      return "none";
  }
};

const getMedia = (data) => {
  switch (data?.media?.__typename) {
    case "MediaImage":
      return {
        __typename: "image",
        src: data?.media?.image?.url,
        width: data?.media?.image?.width,
        height: data?.media?.image?.height,
        alt: data?.media?.image?.alt,
      };
    case "MediaRemoteVideo":
      return {
        __typename: "video",
        src: data?.media?.url,
        title: data?.media?.name,
        transcript: data?.media?.transcript,
      };
  }
};

const getPosition = (data, column) => {
  switch (column) {
    case "primary":
      switch (data?.mediaImageSize) {
        case "small":
        case "medium":
          return "left";
        default:
          return "above";
      }
    case "secondary":
      return "above";
    default:
      return data?.mediaAlignment?.name ?? "left";
  }
};

export function MediaTextWidget({ data }) {
  const context = useContext(SectionContext);
  const background = getBackground(data);
  const size = data?.mediaImageSize ?? "large";
  const media = getMedia(data);
  const position = getPosition(data, context?.column);

  const classes = tv({
    slots: {
      base: "col-span-1 h-full w-full",
      heading: "mt-0!",
      body: "",
    },
    variants: {
      background: {
        none: "",
        "grey-light": "",
        "grey-dark": {
          heading: "text-body-copy-bold-on-dark!",
          body: "[&_*]:text-body-copy-on-dark!",
        },
      },
    },
  })({ background: background });

  return (
    <MediaCaption
      src={media.src}
      height={media?.height}
      width={media?.width}
      alt={media?.alt}
      as={media.__typename === "image" ? Image : EmbeddedVideo}
      background={background}
      size={size}
      position={position}
      className={classes.base()}
      transcript={media?.transcript}
    >
      {data?.heading && (
        <Typography className={classes.heading()} type={data?.headingLevel ?? "h3"} as={data?.headingLevel ?? "h3"}>
          {data?.heading}
        </Typography>
      )}

      <div className={classes.body()}>
        <HtmlParser html={data?.description?.processed ?? ""} />
      </div>

      {data?.buttonSection && <ButtonSectionWidget data={data.buttonSection} />}
    </MediaCaption>
  );
}
