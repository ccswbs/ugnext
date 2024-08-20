import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { twJoin, twMerge } from 'tailwind-merge';
import Image from 'next/image';

const PreviousBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={twMerge(twJoin('z-10 top-1/3 right-4'), className)} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} className="text-yellow-400 text-[4.5rem]" />
    </div>
  );
};

const NextBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={twMerge(twJoin('z-10 top-1/3 right-4'), className)} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronRight} className="text-yellow-400 text-[4.5rem]" />
    </div>
  );
};

const Card = ({ img, title, name, description }) => {
  return (
    <div className="flex items-center flex-row text-left text-gray-700 px-5">
      <Image src={img} width={120} height={120} alt={title} className="p-2 mb-5 rounded-full" />
      <div className="flex items-left flex-col ml-5">
        <p>{description}</p>
        <div className="border-l-4 border-yellow-400 pl-4">
          <p className="mb-0">
            <span className="font-semibold">{name}</span>
          </p>
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

export const Testimonials = ({ testimonialData }) => {
  const settings = {
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="testimonial w-full flex md:flex md:justify-center">
      <div className="text-center mx-auto md:px-5" style={{ width: '90%' }}>
        <Slider className="px-5" {...settings}>
          {testimonialData.map((item, index) => (
            <Card key={index} img={item.img} title={item.title} name={item.name} description={item.description} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
