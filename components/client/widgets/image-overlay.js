import red from "@/img/red-background.webp";
import yellow from "@/img/yellow-background.webp";
import {
  Blockquote,
  BlockquoteAuthor,
  BlockquoteAuthorName,
  BlockquoteAuthorTitle,
  BlockquoteContent,
} from "@uoguelph/react-components/blockquote";
import { ButtonSectionWidget } from "@/components/client/widgets/button-section";
import { ImageOverlay } from "@uoguelph/react-components/image-overlay";
import { MediaCaption } from "@uoguelph/react-components/media-caption";
import React from "react";
import { GeneralTextWidget } from "@/components/client/widgets/general-text";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { twJoin } from "tailwind-merge";

const StoryQuoteContent = ({ data, style, overlay }) => {
  const image = data.image?.image
    ? {
        src: data.image?.image.url,
        height: data.image?.image.height,
        width: data.image?.image.width,
        alt: data.image?.image.alt,
      }
    : null;

  const Quote = ({ hideQuotationMarks = false }) => (
    <Blockquote
      hideQuotationMarks={hideQuotationMarks}
      color={style === "Red background" ? "yellow" : "blue"}
      className={twJoin(
        "text-inherit text-left mt-4 md:mt-0",
        (overlay === "dark" || style === "Red background") && "text-white"
      )}
    >
      <BlockquoteContent className="text-4xl!">{data?.quoteContent}</BlockquoteContent>

      <BlockquoteAuthor className="text-xl!">
        {data?.quoteSource && <BlockquoteAuthorName>{data.quoteSource}</BlockquoteAuthorName>}
        {data?.quoteDescription && <BlockquoteAuthorTitle>{data?.quoteDescription}</BlockquoteAuthorTitle>}
      </BlockquoteAuthor>
    </Blockquote>
  );

  if (image) {
    return (
      <MediaCaption
        position="left"
        size="medium"
        src={image?.url}
        width={image?.width}
        height={image?.height}
        alt={image?.alt}
        className="[&_.uofg-media-caption-media]:rounded-full h-full"
        as={Image}
      >
        <Quote hideQuotationMarks />
      </MediaCaption>
    );
  }

  return (
    <Container className="flex flex-col gap-8">
      <Quote />
    </Container>
  );
};

const SectionButtonContent = ({ data }) => <ButtonSectionWidget key={data?.id ?? index} data={data} />;

const GeneralTextContent = ({ data }) => (
  <Container>
    <GeneralTextWidget key={data?.id ?? index} data={data} />
  </Container>
);

export function ImageOverlayWidget({ data }) {
  const images = {
    "Yellow background": yellow,
    "Red background": red,
  };

  const overlays = {
    "Dark overlay": "dark",
    "Light overlay": "light",
  };

  const alignments = {
    "Centre middle": {
      horizontal: "center",
      vertical: "center",
    },
    "Left middle": {
      horizontal: "left",
      vertical: "center",
    },
    "Bottom middle": {
      horizontal: "center",
      vertical: "bottom",
    },
  };

  const style = data.imageOverlayStyle?.name;
  const image = images[style] ?? data?.backgroundImage?.image;
  const overlay = overlays[style] ?? "none";
  const alignment = alignments[data?.contentAlignment?.name] ?? "center";

  return (
    <ImageOverlay
      id={`image-overlay-${data.uuid}`}
      alt={image.alt ?? ""}
      src={image.url ?? image.src}
      width={image.width}
      height={image.height}
      overlay={overlay}
      horizontalAlignment={alignment.horizontal}
      verticalAlignment={alignment.vertical}
      blurred={false}
      as={Image}
    >
      {data.imageOverlayContent
        ?.map((data, index) => {
          switch (data?.__typename) {
            case "ParagraphGeneralText":
              return <GeneralTextContent key={data?.id ?? index} data={data} />;
            case "ParagraphStoryQuote":
              return <StoryQuoteContent key={data?.id ?? index} data={data} style={style} overlay={overlay} />;
            case "ParagraphSectionButton":
              return <SectionButtonContent key={data?.id ?? index} data={data} />;
            default:
              return null;
          }
        })
        .filter(Boolean)}
    </ImageOverlay>
  );
}
