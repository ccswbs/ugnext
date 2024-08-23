import red from '@/img/red-background.webp';
import yellow from '@/img/yellow-background.webp';
import Image from 'next/image';
import { Container } from '@/components/container';
import { twJoin } from 'tailwind-merge';
import { HtmlParser } from '@/components/html-parser';
import { Profile } from '@/components/profile';
import { Blockquote } from '@/components/blockquote';
import { ButtonSection } from '@/components/widgets/button-section';

const getImage = (data) => {
  switch (data.imageOverlayStyle?.name?.toLowerCase()) {
    case 'yellow background':
      return yellow;
    case 'red background':
      return red;
    default:
      return data?.backgroundImage?.image ? data.backgroundImage.image : yellow;
  }
};

const Content = ({ data, style }) => {
  switch (data?.__typename) {
    case 'ParagraphGeneralText':
      return (
        <div className="[&_*]:text-inherit">
          <HtmlParser html={data.body.processed} />
        </div>
      );
    case 'ParagraphStoryQuote':
      const image = data.image?.image;

      return (
        <Profile
          image={
            image
              ? {
                  src: image.url,
                  height: image.height,
                  width: image.width,
                  alt: image.alt,
                }
              : undefined
          }
          body={
            <Blockquote
              color={style === 'yellow background' ? 'red' : 'yellow'}
              className="text-inherit text-left xl:text-4xl"
            >
              {data?.quoteContent}
            </Blockquote>
          }
          footer={
            <>
              {data?.quoteSource && <span className="text-xl">{data.quoteSource}</span>}
              {data?.quoteDescription && <span className="text-xl">{data.quoteDescription}</span>}
            </>
          }
          color={style === 'yellow background' ? 'red' : 'yellow'}
        />
      );
    case 'ParagraphSectionButton':
      return <ButtonSection data={data} />;
    default:
      return <></>;
  }
};

export const ImageOverlay = ({ data }) => {
  console.log(data);
  const background = getImage(data);
  const style = data.imageOverlayStyle?.name?.toLowerCase();
  const alignment = data?.contentAlignment?.name?.toLowerCase();
  const content = data.imageOverlayContent;

  return (
    <div className="flex flex-col relative w-full h-fit lg:min-h-[60rem]">
      <div className="absolute w-full h-full z-10">
        <Image
          className="w-full h-full object-cover"
          src={background.src ?? background.url}
          width={background.width}
          height={background.height}
          alt={background.alt || ''}
        />

        {(style === 'dark overlay' || style === 'light overlay') && (
          <div
            className={twJoin(
              'absolute top-0 left-0 w-full h-full',
              style === 'dark overlay' && 'bg-black/60',
              style === 'light overlay' && 'bg-white/60',
            )}
          ></div>
        )}
      </div>

      <Container
        className={twJoin(
          'relative py-20 flex flex-col z-20 flex-1',
          (style === 'dark overlay' || style === 'red background') && 'text-white',
          alignment === 'centre middle' && 'justify-center items-center',
          alignment === 'left middle' && 'justify-center items-start',
          alignment === 'centre bottom' && 'justify-end items-center',
        )}
        centered
      >
        {content?.map((data, index) => (
          <Content key={data.id ?? index} data={data} style={style} />
        ))}
      </Container>
    </div>
  );
};
