import { Story as StoryComponent } from '@/components/story';
import { Statistics } from '@/components/widgets/statistics';
import { HtmlParser } from '@/components/html-parser';
import { twJoin } from 'tailwind-merge';
import { Blockquote } from '../blockquote';

export const Story = ({ data }) => {
  return (
    <>
      {data.content
        ?.map((content) => {
          switch (content.__typename) {
            case 'ParagraphStoryImageCutoutBackground':
              const quotes = content.storyContent?.filter((node) => node.__typename === 'ParagraphStoryQuote');

              console.log(quotes);

              return (
                <StoryComponent
                  key={content?.id ?? index}
                  backgroundImage={{
                    src: content.backgroundImage.image.url,
                    width: content.backgroundImage.image.width,
                    height: content.backgroundImage.image.height,
                    alt: content.backgroundImage.image.alt,
                    className: twJoin('brightness-50'),
                  }}
                  foregroundImage={{
                    src: content.foregroundImage.image.url,
                    width: content.foregroundImage.image.width,
                    height: content.foregroundImage.image.height,
                    alt: content.foregroundImage.image.alt,
                  }}
                  content={
                    <div className="flex flex-col text-white">
                      <span className="text-2xl mb-4">{content.title}</span>
                      {content.text && <HtmlParser html={content.text.processed} />}
                    </div>
                  }
                  footer={
                    quotes.length > 0 && (
                      <div>
                        {quotes.map((quote) => {
                          return (
                            <div className="flex flex-col justify-center items-center gap-4" key={quote.id}>
                              <Blockquote>{quote.quoteContent}</Blockquote>
                              <span className="">~ {quote.quoteSource}</span>
                            </div>
                          );
                        })}
                      </div>
                    )
                  }
                />
              );
            case 'ParagraphStatisticWidget':
              return <Statistics key={content?.id ?? index} data={content} />;
            default:
              return null;
          }
        })
        ?.filter(Boolean)}
    </>
  );
};
