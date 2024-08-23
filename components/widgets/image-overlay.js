import red from '@/img/red-background.webp';
import yellow from '@/img/yellow-background.webp';
import Image from 'next/image';
import { Container } from '@/components/container';
import { twJoin } from 'tailwind-merge';

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

export const ImageOverlay = ({ data }) => {
  console.log(data);
  const background = getImage(data);
  const style = data.imageOverlayStyle?.name?.toLowerCase();
  const alignment = data?.contentAlignment?.name?.toLowerCase();

  return (
    <div className="w-full h-fit grid grid-cols-1">
      <Image
        className="row-start-1 col-start-1 w-full h-full object-cover"
        src={background.src ?? background.url}
        width={background.width}
        height={background.height}
        alt={background.alt || ''}
      />

      {(style === 'dark overlay' || style === 'light overlay') && (
        <div
          className={twJoin(
            'row-start-1 col-start-1 w-full h-full object-cover',
            style === 'dark overlay' && 'bg-black/50',
            style === 'light overlay' && 'bg-white/60',
          )}
        ></div>
      )}

      <Container
        className={twJoin(
          'flex flex-col row-start-1 col-start-1',
          (style === 'dark overlay' || style === 'red background') && 'text-white',
          alignment === 'centre middle' && 'justify-center items-center',
          alignment === 'left middle' && 'justify-center items-start',
          alignment === 'centre bottom' && 'justify-end items-center',
        )}
        centered
      >
        <div>content here</div>
      </Container>
    </div>
  );
};
