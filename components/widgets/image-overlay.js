import red from '@/img/red-background.webp';
import yellow from '@/img/yellow-background.webp';
import { twJoin } from 'tailwind-merge';
import { HtmlParser } from '@/components/html-parser';
import { Profile } from '@/components/profile';
import { Blockquote } from '@/components/blockquote';
import { ButtonSection } from '@/components/widgets/button-section';
import { ImageOverlay as ImageOverlayComponent } from '@/components/image-overlay';

export const ImageOverlay = ({ data }) => {
  const images = {
    'Yellow background': yellow,
    'Red background': red,
  };

  const overlays = {
    'Dark overlay': 'dark',
    'Light overlay': 'light',
  };

  const alignments = {
    'Centre middle': 'center',
    'Left middle': 'left',
    'Bottom middle': 'bottom',
  };

  const style = data.imageOverlayStyle?.name;
  const image = images[style] ?? data?.backgroundImage?.image;
  const overlay = overlays[style] ?? 'none';
  const alignment = alignments[data?.contentAlignment?.name] ?? 'center';

  return (
    <ImageOverlayComponent
      alignment={alignment}
      overlay={overlay}
      image={{
        src: image.src ?? image.url,
        width: image.width,
        height: image.height,
        alt: image.alt,
      }}
    >
      <div className={twJoin((style === 'Dark overlay' || style === 'Red background') && 'text-white')}>
        {data.imageOverlayContent?.map((data, index) => {
          switch (data?.__typename) {
            case 'ParagraphGeneralText':
              return (
                <div className="[&_*]:text-inherit">
                  <HtmlParser html={data.body.processed} />
                </div>
              );
            case 'ParagraphStoryQuote':
              const image = data.image?.image
                ? {
                    src: data.image?.image.url,
                    height: data.image?.image.height,
                    width: data.image?.image.width,
                    alt: data.image?.image.alt,
                  }
                : null;

              return (
                <Profile
                  image={image}
                  body={
                    <Blockquote
                      color={style === 'Yellow background' ? 'red' : 'yellow'}
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
                  color={style === 'Yellow background' ? 'red' : 'yellow'}
                />
              );
            case 'ParagraphSectionButton':
              return <ButtonSection data={data} />;
            default:
              return <></>;
          }
        })}
      </div>
    </ImageOverlayComponent>
  );
};
