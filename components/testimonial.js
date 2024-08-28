import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar } from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import { twJoin, twMerge } from 'tailwind-merge';

const PreviousBtn = (props) => {
  const { className, onClick, displayType } = props;
  return (
    <div 
      className={twMerge(twJoin(`z-10 ${displayType === 'col' ? '!top-auto !right-20 bottom-0 my-0 mx-auto sm:top-1/3 sm:right-auto sm:bottom-auto' : ''}`), className)}
      onClick={onClick} style={{ top:'33%', left:'0px' }} >
      <ArrowBackIos className='text-yellow-400  hover:text-black' style={{ fontSize: "45px" }} />
    </div>
  );
};

const NextBtn = (props) => {
  const { className, onClick, displayType } = props;
  return (
    <div 
      className={twMerge(twJoin(`z-10 ${displayType === 'col' ? '!top-auto !left-20 bottom-0 my-0 mx-auto sm:top-1/3 sm:left-auto sm:bottom-auto' : ''}`), className)}
      onClick={onClick} style={{ top:'33%', right:'10px' }} >
      <ArrowForwardIos className='text-yellow-400 hover:text-black' style={{ fontSize: "45px" }} />
    </div>
  );
};

const Card = ({ img, title, name, description, displayType }) => {
  return (
    <div
      className={`flex items-center ${displayType === 'col' ? 'flex-col hover:bg-yellow-400' : 'flex-row'} text-left text-gray-700 px-5`}
    >
      <Avatar
        imgProps={
          displayType !== 'col' ?{ style: { borderRadius: "50%" } }:{}
        }
        src={img}
        style={
          displayType === 'col' ?{
            borderRadius:0,
            width:'100%',
            height:'100%',
            marginBottom: 20,
          }:{
            width: 120,
            height: 120,
            padding: 7,
            marginBottom: 20,
          }
        }
      />
      <div className={`${displayType === 'col' ? 'w-full' : ''} flex items-left flex-col ml-51`}>
      {displayType === 'col' ? (
          <div  className='p-2'>
            {/* Title Section First */}
            <div>
              <p className='mb-0'>
                <span className="font-semibold">{name}</span>
              </p>
              <p>
                <span className="font-semibold">{title}</span>
              </p>
            </div>
            {/* Description After Title */}
            <p>{description}</p>
          </div>
        ) : (
          <>
            {/* Description First */}
            <p>{description}</p>
            {/* Title Section After Description */}
            <div className='border-l-4 border-yellow-400 pl-4'>
              <p className='mb-0'>
                <span className="font-semibold">{name}</span>
              </p>
              <p>{title}</p>
            </div>
          </>
        )}
        
      </div>
      
    </div>
  );
};

export const Testimonials = ({testimonialData, slideNum, displayType=''}) => {
    
  const settings = {
    prevArrow: <PreviousBtn displayType = {displayType} />,
    nextArrow: <NextBtn displayType = {displayType} />,
    dots: false,
    slidesToShow: slideNum,
    slidesToScroll: 1,
    responsive: [      
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='testimonial w-full flex md:flex md:justify-center'>
      <div className='text-center mx-auto md:px-5' style={{ width: "90%" }}>
        <Slider className='px-5' {...settings}>
          {testimonialData.map((item, index) => (
            <Card
              key={index}
              img={item.img}
              title={item.title}
              name={item.name}
              description={item.description}
              displayType={displayType}              
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};
