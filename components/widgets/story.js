import { Story as StoryComponent } from "@/components/story";
import { Statistics } from "@/components/widgets/statistics";
import { HtmlParser } from "@/components/html-parser";
import { twJoin } from "tailwind-merge";
import { Blockquote } from "@/components/blockquote";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { Modal } from "@/components/modal";
import { useState } from "react";
import { EmbeddedVideo } from "@/components/embedded-video";

const StoryImageCutoutBackground = ({ data }) => {
  const quotes = data.storyContent?.filter((node) => node.__typename === "ParagraphStoryQuote") ?? [];
  const buttons = data.storyContent?.filter((node) => node.__typename === "ParagraphStoryModalVideo") ?? [];

  return (
    <StoryComponent
      key={data?.id ?? index}
      backgroundImage={{
        src: data.backgroundImage.image.url,
        width: data.backgroundImage.image.width,
        height: data.backgroundImage.image.height,
        alt: data.backgroundImage.image.alt,
        className: twJoin("brightness-50"),
      }}
      foregroundImage={{
        src: data.foregroundImage.image.url,
        width: data.foregroundImage.image.width,
        height: data.foregroundImage.image.height,
        alt: data.foregroundImage.image.alt,
        className: twJoin("pt-10"),
      }}
      content={
        <div className="flex flex-col text-white">
          <span className="text-2xl font-bold mb-4">{data.title.toUpperCase()}</span>
          {data.text && <HtmlParser html={data.text.processed} />}
          {buttons.map((button) => (
            <EmbeddedVideo
              key={button.video.url}
              src={button.video.url}
              title={button.video.name}
              transcript={button.video?.transcript?.url}
              modal={{
                button: (
                  <>
                    <FontAwesomeIcon icon={faPlay} />
                    <span>Watch Video</span>
                  </>
                ),
                style: "red",
                className: "w-fit gap-2",
              }}
            />
          ))}
        </div>
      }
      footer={
        quotes.length > 0 && (
          <div>
            {quotes.map((quote) => {
              return (
                <div className="flex flex-col justify-center items-center gap-4" key={quote.id}>
                  <Blockquote color="blue" className="font-thin text-3xl tracking-wider">
                    {quote.quoteContent}
                  </Blockquote>
                  <span className="text-light-blue">~ {quote.quoteSource}</span>
                </div>
              );
            })}
          </div>
        )
      }
    />
  );
};

export const Story = ({ data }) => {
  return (
    <>
      {data.content
        ?.map((content) => {
          switch (content.__typename) {
            case "ParagraphStoryImageCutoutBackground":
              return <StoryImageCutoutBackground key={content?.id ?? index} data={content} />;
            case "ParagraphStatisticWidget":
              return <Statistics key={content?.id ?? index} data={content} />;
            default:
              return null;
          }
        })
        ?.filter(Boolean)}
    </>
  );
};
