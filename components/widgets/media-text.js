import { twJoin } from "tailwind-merge";
import { extractVideoID, computeLayoutMediaText, buttonStyle } from "@/lib/ug-utils";
import Image from "next/image";
import { Heading } from "@/components/heading";
import { EmbeddedVideo } from "@/components/embedded-video";
import { HtmlParser } from "@/components/html-parser";
import { ButtonSection } from "@/components/widgets/button-section";
import ConditionalWrap from "conditional-wrap";
import { MediaCaption } from "@/components/media-caption";
import { useContext } from "react";
import { SectionContext } from "@/components/section";

const getBackground = (data) => {
  switch (data?.background?.name) {
    case "Light Blue":
      return "light-blue";
    case "Dark Gray":
      return "dark-grey";
    default:
      return "none";
  }
};

const getMedia = (data) => {
  switch (data?.media?.__typename) {
    case "MediaImage":
      return {
        src: data?.media?.image?.url,
        width: data?.media?.image?.width,
        height: data?.media?.image?.height,
        alt: data?.media?.image?.alt,
      };
    case "MediaRemoteVideo":
      return {
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

export const MediaText = ({ data }) => {
  const context = useContext(SectionContext);
  const background = getBackground(data);
  const size = data?.mediaImageSize ?? "small";
  const media = getMedia(data);
  const position = getPosition(data, context?.column);
  const headingLevel = data?.headingLevel ?? 3;

  console.log(context);

  return (
    <MediaCaption media={media} background={background} size={size} position={position}>
      {data?.heading && <Heading level={headingLevel}>{data?.heading}</Heading>}

      <HtmlParser html={data?.description?.processed ?? ""} />

      {data?.buttonSection && <ButtonSection data={data.buttonSection} />}
    </MediaCaption>
  );
};
