import { StatisticsWidget } from "@/components/client/widgets/statistics";
import { HtmlParser } from "@/components/client/html-parser";
import {
  Blockquote,
  BlockquoteContent,
  BlockquoteAuthor,
  BlockquoteAuthorName,
} from "@uoguelph/react-components/blockquote";
import { EmbeddedVideo, EmbeddedVideoModalButton } from "@uoguelph/react-components/embedded-video";
import {
  Story,
  StoryBackground,
  StoryBackgroundImage,
  StoryBody,
  StoryFooter,
  StoryForeground,
  StoryForegroundContent,
  StoryForegroundImage,
} from "@uoguelph/react-components/story";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@awesome.me/kit-7993323d0c/icons/classic/solid";

function StoryImageCutoutBackground({ data }) {
  const quotes = data.storyContent?.filter((node) => node.__typename === "ParagraphStoryQuote") ?? [];
  const buttons = data.storyContent?.filter((node) => node.__typename === "ParagraphStoryModalVideo") ?? [];

  return (
    <Story>
      <StoryBody>
        <StoryBackground>
          <StoryBackgroundImage
            src={data.backgroundImage.image.url}
            alt={data.backgroundImage.image.alt}
            height={data.backgroundImage.image.height}
            width={data.backgroundImage.image.width}
            as={Image}
          />
        </StoryBackground>

        <StoryForeground>
          <StoryForegroundContent className="pt-8!">
            <div className="flex flex-col *:text-white!">
              <span className="text-2xl font-bold mb-4">{data.title.toUpperCase()}</span>
              {data.text && <HtmlParser html={data.text.processed} />}
              {buttons.map((button) => (
                <EmbeddedVideo
                  key={button.video.url}
                  src={button.video.url}
                  title={button.video.name}
                  transcript={button.video?.transcript?.url}
                >
                  <EmbeddedVideoModalButton type="red" className="flex gap-2 w-fit mt-4">
                    <FontAwesomeIcon icon={faPlay} />
                    <span>Watch Video</span>
                  </EmbeddedVideoModalButton>
                </EmbeddedVideo>
              ))}
            </div>
          </StoryForegroundContent>

          <StoryForegroundImage
            src={data.foregroundImage.image.url}
            alt={data.foregroundImage.image.alt}
            height={data.foregroundImage.image.height}
            width={data.foregroundImage.image.width}
            as={Image}
          />
        </StoryForeground>
      </StoryBody>

      {quotes.length > 0 && (
        <StoryFooter>
          {quotes.map((quote) => {
            return (
              <div className="flex flex-col justify-center items-center gap-4" key={quote.id}>
                <Blockquote color="blue" className="font-thin text-3xl tracking-wider">
                  <BlockquoteContent>{quote.quoteContent}</BlockquoteContent>
                </Blockquote>
                <BlockquoteAuthor className="text-light-blue">
                  <BlockquoteAuthorName>{quote.quoteSource}</BlockquoteAuthorName>
                </BlockquoteAuthor>
              </div>
            );
          })}
        </StoryFooter>
      )}
    </Story>
  );
}

export function StoryWidget({ data }) {
  return (
    <>
      {data.content
        ?.map((content) => {
          switch (content.__typename) {
            case "ParagraphStoryImageCutoutBackground":
              return <StoryImageCutoutBackground key={content?.id ?? index} data={content} />;
            case "ParagraphStatisticWidget":
              return <StatisticsWidget key={content?.id ?? index} data={content} />;
            default:
              return null;
          }
        })
        ?.filter(Boolean)}
    </>
  );
}
