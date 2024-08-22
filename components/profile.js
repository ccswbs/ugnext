import Image from 'next/image';
import { twJoin, twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import React from 'react';
import { Info } from '@/components/info';

export const Profile = ({ image, body, footer }) => {
  return (
    <div className="flex text-gray-700 gap-5 w-full px-4">
      {image && (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          className={twMerge('rounded-full w-[15rem] h-[15rem] object-cover object-center', image?.className)}
        />
      )}
      <div className={twJoin('flex flex-col gap-6', !footer && 'my-auto')}>
        <div className="text-lg">{body}</div>
        {footer && <Info color="yellow">{footer}</Info>}
      </div>
    </div>
  );
};

Profile.propTypes = {
  image: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
  }),
  body: PropTypes.node.isRequired,
  footer: PropTypes.node,
};
