import red from "@/img/red-background.webp";
import yellow from "@/img/yellow-background.webp";
import { twJoin } from "tailwind-merge";
import { HtmlParser } from "@/components/html-parser";
import { Blockquote } from "@/components/blockquote";
import { ButtonSectionWidget } from "@/components/widgets/button-section";
import { ImageOverlay as ImageOverlayComponent } from "@/components/image-overlay";
import { Info } from "@/components/info";
import { MediaCaption } from "@/components/media-caption";
import React from "react";

const GeneralTextContent = ({ data }) => (
  <div key={data?.id ?? index} className="**:text-inherit">
    <HtmlParser html={data.body.processed} />
  </div>
);

const StoryQuoteContent = ({ data, style }) => {
  const image = data.image?.image
    ? {
        src: data.image?.image.url,
        height: data.image?.image.height,
        width: data.image?.image.width,
        alt: data.image?.image.alt,
      }
    : null;

  if (image) {
    return (
      <MediaCaption
        size="medium"
        position="left"
        className="h-full"
        media={
          image && {
            src: image?.url,
            width: image?.width,
            height: image?.height,
            alt: image?.alt,
            className: "rounded-full",
          }
        }
      >
        <Blockquote
          color={style === "Yellow background" ? "red" : "yellow"}
          className="text-inherit text-left xl:text-4xl mt-4 md:mt-0"
        >
          {data?.quoteContent}
        </Blockquote>

        <Info color={style === "Yellow background" ? "red" : "yellow"}>
          <div className="flex flex-col gap-0.5">
            {data?.quoteSource && <span className="text-xl font-bold">{data.quoteSource}</span>}
            {data?.quoteDescription && <span className="text-xl">{data.quoteDescription}</span>}
          </div>
        </Info>
      </MediaCaption>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Blockquote
        color={style === "Yellow background" ? "red" : "yellow"}
        className="text-inherit text-left xl:text-4xl mt-4 md:mt-0"
      >
        {data?.quoteContent}
      </Blockquote>

      <Info color={style === "Yellow background" ? "red" : "yellow"}>
        <div className="flex flex-col gap-0.5">
          {data?.quoteSource && <span className="text-xl font-bold">{data.quoteSource}</span>}
          {data?.quoteDescription && <span className="text-xl">{data.quoteDescription}</span>}
        </div>
      </Info>
    </div>
  );
};

const SectionButtonContent = ({ data }) => <ButtonSectionWidget key={data?.id ?? index} data={data} />;

export const ImageOverlay = ({ data }) => {
  const images = {
    "Yellow background": yellow,
    "Red background": red,
  };

  const overlays = {
    "Dark overlay": "dark",
    "Light overlay": "light",
  };

  const alignments = {
    "Centre middle": "center",
    "Left middle": "left",
    "Bottom middle": "bottom",
  };

  const style = data.imageOverlayStyle?.name;
  const image = images[style] ?? data?.backgroundImage?.image;
  const overlay = overlays[style] ?? "none";
  const alignment = alignments[data?.contentAlignment?.name] ?? "center";

  return (
    <ImageOverlayComponent
      alignment={alignment}
      overlay={overlay}
      image={{
        src: image.src ?? image.url,
        width: image.width,
        height: image.height,
        alt: image.alt ?? "",
      }}
    >
      <div className={twJoin((style === "Dark overlay" || style === "Red background") && "text-white")}>
        {data.imageOverlayContent
          ?.map((data, index) => {
            switch (data?.__typename) {
              case "ParagraphGeneralText":
                return <GeneralTextContent key={data?.id ?? index} data={data} />;
              case "ParagraphStoryQuote":
                return <StoryQuoteContent key={data?.id ?? index} data={data} style={style} />;
              case "ParagraphSectionButton":
                return <SectionButtonContent key={data?.id ?? index} data={data} />;
              default:
                return null;
            }
          })
          .filter(Boolean)}
      </div>
    </ImageOverlayComponent>
  );
};
