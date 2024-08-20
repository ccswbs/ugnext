import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { Link } from '@/components/link';

export const Testimonial = ({ image, name, description, quote, link }) => {
  return (
    <div className="flex text-gray-700 gap-5 w-full px-4">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className={twMerge('rounded-full w-[15rem] h-[15rem] object-cover object-center', image?.className)}
      />
      <div className="flex flex-col gap-6">
        <blockquote className="italic text-gray-500 text-lg">{quote}</blockquote>
        <div className="flex flex-col gap-0.5 border-l-4 border-yellow-400 pl-3">
          <p className="mb-0 font-semibold py-0 px-1">{name}</p>
          <p className="mb-0 py-0 px-1 text-red">{description}</p>
          {link && (
            <Link className="m-0 py-0 px-1 w-fit" href={link.url}>{link.title}</Link>
          )}
        </div>
      </div>
    </div>
  );
};

Testimonial.propTypes = {
  image: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};
