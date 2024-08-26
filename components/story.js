import PropTypes from 'prop-types';
import Image from 'next/image';
import { twJoin, twMerge } from 'tailwind-merge';
import { Container } from '@/components/container';

export const Story = ({ backgroundImage, foregroundImage, content, footer }) => {
  return (
    <div className="flex w-full flex-col">
      <div className="relative flex w-full items-center justify-center overflow-hidden">
        <div className="absolute z-0 h-full max-h-full w-full">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            className={twMerge('w-full h-full object-cover', backgroundImage?.className)}
            width={backgroundImage?.width}
            height={backgroundImage?.height}
            sizes="100vw"
          />
        </div>

        <div className="container z-10 flex w-full max-w-max-content flex-col items-center gap-6 px-4 lg:flex-row">
          <div className="flex w-full justify-center px-8 lg:p-0 lg:w-1/2">{content}</div>
          <div className="flex w-full justify-center lg:mt-auto lg:w-1/2">
            <Image
              src={foregroundImage.src}
              alt={foregroundImage.alt}
              className={twMerge('h-full w-full', foregroundImage?.className)}
              width={foregroundImage?.width}
              height={foregroundImage?.height}
              sizes="(max-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>

      {footer && (
        <div className="flex w-full items-center justify-center bg-black p-4 text-white">
          <Container className="text-xl">{footer}</Container>
        </div>
      )}
    </div>
  );
};

Story.propTypes = {
  backgroundImage: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
  }).isRequired,
  foregroundImage: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
  }).isRequired,
  content: PropTypes.node.isRequired,
  footer: PropTypes.node,
};
