import { Story as StoryComponent } from '@/components/story';
import { Statistics } from '@/components/widgets/statistics';
import { HtmlParser } from '@/components/html-parser';
import { twJoin } from 'tailwind-merge';
import { Blockquote } from '@/components/blockquote';
import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { Modal } from '@/components/modal';
import { useState } from 'react';

export const Story = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {data.content
        ?.map((content) => {
          switch (content.__typename) {
            case 'ParagraphStoryImageCutoutBackground':
              const quotes = content.storyContent?.filter((node) => node.__typename === 'ParagraphStoryQuote') ?? [];
              const buttons =
                content.storyContent?.filter((node) => node.__typename === 'ParagraphStoryModalVideo') ?? [];

              console.log(buttons);

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
                    className: twJoin('pt-10'),
                  }}
                  content={
                    <div className="flex flex-col text-white">
                      <span className="text-2xl font-bold mb-4">{content.title.toUpperCase()}</span>
                      {content.text && <HtmlParser html={content.text.processed} />}
                      {buttons.map((button) => (
                        <Button
                          key={button.id}
                          className="flex gap-2 w-fit p-3 mt-4"
                          color="red"
                          onClick={() => {
                            setModalOpen(!modalOpen);
                          }}
                        >
                          {button?.title ?? (
                            <>
                              <FontAwesomeIcon icon={faPlay} />
                              <span>Watch Video</span>
                            </>
                          )}
                        </Button>
                      ))}
                      {buttons.length > 0 && (
                        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                          Testing
                        </Modal>
                      )}
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
