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
import { tv } from "tailwind-variants";
import type { 
  ImageOverlayFragment, 
  StoryQuoteFragment, 
  GeneralTextFragment, 
  ButtonSectionFragment 
} from "@/lib/graphql/types";

type ImageOverlayStyle = "Red background" | "Yellow background" | null | undefined;
type OverlayType = "dark" | "light" | "none";
type AlignmentHorizontal = "center" | "left" | "right";
type AlignmentVertical = "center" | "bottom" | "top";

interface Alignment {
  horizontal: AlignmentHorizontal;
  vertical: AlignmentVertical;
}

interface ImageData {
  src?: string;
  height?: number;
  width?: number;
  alt?: string;
  url?: string;
}

interface StoryQuoteContentProps {
  data: StoryQuoteFragment;
  style: ImageOverlayStyle;
  overlay: OverlayType;
  alignment: Alignment;
}

interface SectionButtonContentProps {
  data: ButtonSectionFragment;
  style: ImageOverlayStyle;
  overlay: OverlayType;
  alignment: Alignment;
}

interface GeneralTextContentProps {
  data: GeneralTextFragment;
  style: ImageOverlayStyle;
  overlay: OverlayType;
  alignment: Alignment;
}

interface ImageOverlayWidgetProps {
  data: ImageOverlayFragment;
}

interface QuoteProps {
  hideQuotationMarks?: boolean;
}

const StoryQuoteContent: React.FC<StoryQuoteContentProps> = ({ data, style, overlay, alignment }) => {
  const image: ImageData | null = data.image?.image
    ? {
        src: data.image.image.url,
        height: data.image.image.height,
        width: data.image.image.width,
        alt: data.image.image.alt ?? undefined,
      }
    : null;

  const Quote: React.FC<QuoteProps> = ({ hideQuotationMarks = false }) => (
    <Blockquote
      hideQuotationMarks={hideQuotationMarks}
      color={style === "Red background" ? "yellow" : "blue"}
      className={twJoin(
        "text-inherit text-left mt-4 md:mt-0",
        (overlay === "dark" || style === "Red background") && "text-white",
        (overlay === "light" || style === "Yellow background") && "text-black"
      )}
    >
      <BlockquoteContent className="text-4xl!">{data?.quoteContent}</BlockquoteContent>

      <BlockquoteAuthor className="text-xl!">
        {data?.quoteSource && <BlockquoteAuthorName>{data.quoteSource}</BlockquoteAuthorName>}
        {data?.quoteDescription && <BlockquoteAuthorTitle>{data?.quoteDescription}</BlockquoteAuthorTitle>}
      </BlockquoteAuthor>
    </Blockquote>
  );

  if (image && image.url) {
    return (
      <MediaCaption
        position="left"
        size="medium"
        src={image.url}
        width={image.width}
        height={image.height}
        alt={image.alt ?? ""}
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

const SectionButtonContent: React.FC<SectionButtonContentProps> = ({ data, style, overlay, alignment }) => (
  <div
    className={twJoin(
      (overlay === "dark" || style === "Red background") && "dark",
      (overlay === "light" || style === "Yellow background") && "light",
      alignment.horizontal === "center" && "[&>.uofg-container]:justify-center"
    )}
  >
    <ButtonSectionWidget data={data} />
  </div>
);

const GeneralTextContent: React.FC<GeneralTextContentProps> = ({ data, style, overlay, alignment }) => (
  <div
    className={twJoin(
      (overlay === "dark" || style === "Red background") && "dark text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_p]:!text-white [&_li]:!text-white [&_span]:!text-white [&_div]:!text-white [&_strong]:!text-white [&_em]:!text-white",
      (overlay === "light" || style === "Yellow background") && "light text-black [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black [&_h4]:!text-black [&_h5]:!text-black [&_h6]:!text-black [&_p]:!text-black [&_li]:!text-black [&_span]:!text-black [&_div]:!text-black [&_strong]:!text-black [&_em]:!text-black"
    )}
  >
    <GeneralTextWidget data={data} />
  </div>
);

export function ImageOverlayWidget({ data }: ImageOverlayWidgetProps): React.JSX.Element {
  const images = {
    "Yellow background": yellow,
    "Red background": red,
  } as const;

  const overlays = {
    "Dark overlay": "dark",
    "Light overlay": "light",
  } as const;

  const alignments = {
    "Centre middle": {
      horizontal: "center" as const,
      vertical: "center" as const,
    },
    "Left middle": {
      horizontal: "left" as const,
      vertical: "center" as const,
    },
    "Bottom middle": {
      horizontal: "center" as const,
      vertical: "bottom" as const,
    },
  } as const;

  const style: ImageOverlayStyle = data.imageOverlayStyle?.name as ImageOverlayStyle;
  const image: ImageData = (images[style as keyof typeof images] ?? data?.backgroundImage?.image) || {};
  const overlay: OverlayType = (overlays[style as keyof typeof overlays] ?? "none") as OverlayType;
  const alignment: Alignment = alignments[data?.contentAlignment?.name as keyof typeof alignments] ?? alignments["Centre middle"];

  const classes = tv({
    base: "p-4",
    variants: {
      horizontal: {
        left: "",
        center: "text-center lg:max-w-[min(137rem,50%)]",
        right: "",
      },
      vertical: {
        top: "",
        center: "",
        bottom: "",
      },
    },
  })({ horizontal: alignment.horizontal, vertical: alignment.vertical });

  return (
    <ImageOverlay
      id={`image-overlay-${data.uuid}`}
      alt={image.alt ?? ""}
      src={image.url ?? image.src ?? ""}
      width={image.width}
      height={image.height}
      overlay={overlay}
      horizontalAlignment={alignment.horizontal}
      verticalAlignment={alignment.vertical}
      blurred={false}
      as={Image}
    >
      {data.imageOverlayContent
        ?.map((contentData, index) => {
          switch (contentData?.__typename) {
            case "ParagraphGeneralText":
              return (
                <Container className={classes} key={contentData?.id ?? index}>
                  <GeneralTextContent 
                    data={contentData as GeneralTextFragment} 
                    style={style} 
                    overlay={overlay} 
                    alignment={alignment} 
                  />
                </Container>
              );
            case "ParagraphStoryQuote":
              return (
                <StoryQuoteContent
                  key={contentData?.id ?? index}
                  data={contentData as StoryQuoteFragment}
                  style={style}
                  overlay={overlay}
                  alignment={alignment}
                />
              );
            case "ParagraphSectionButton":
              return (
                <Container className={classes} key={contentData?.id ?? index}>
                  <SectionButtonContent 
                    data={contentData as ButtonSectionFragment} 
                    style={style} 
                    overlay={overlay} 
                    alignment={alignment} 
                  />
                </Container>
              );
            default:
              return null;
          }
        })
        .filter(Boolean)}
    </ImageOverlay>
  );
}