import Image from 'next/image';
import { twJoin, twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { Container } from '@/components/container';

export const ImageOverlay = ({ image, children, alignment = 'center', overlay = 'none', blurred = false }) => {
  return (
    <div className="flex flex-col relative w-full h-fit lg:min-h-[40rem]">
      <div className="absolute w-full h-full z-10">
        <Image
          className={twMerge('w-full h-full object-cover', blurred && 'blur-sm', image.className)}
          src={image.src}
          width={image.width}
          height={image.height}
          blurDataURL={image.blurred}
          alt={image.alt}
          sizes="100vw"
        />

        {(overlay === 'dark' || overlay === 'light') && (
          <div
            className={twJoin(
              'absolute top-0 left-0 w-full h-full',
              overlay === 'dark' && 'bg-black/60',
              overlay === 'light' && 'bg-white/60',
            )}
          ></div>
        )}
      </div>

      <Container
        centered
        className={twJoin(
          'relative py-20 flex flex-col z-20 flex-1',
          alignment === 'center' && 'justify-center items-center',
          alignment === 'left' && 'justify-center items-start',
          alignment === 'bottom' && 'justify-end items-center',
        )}
      >
        {children}
      </Container>
    </div>
  );
};

ImageOverlay.propTypes = {
  image: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    blurred: PropTypes.string,
    className: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
  alignment: PropTypes.oneOf(['left', 'center', 'bottom']),
  overlay: PropTypes.oneOf(['dark', 'light', 'none']),
  blurred: PropTypes.bool,
};
