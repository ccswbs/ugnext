import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar } from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

const PreviousBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick} style={{ top:'33%' }} >
      <ArrowBackIos className='text-yellow-400' style={{ fontSize: "45px" }} />
    </div>
  );
};

const NextBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick} style={{ top:'33%' }} >
      <ArrowForwardIos className='text-yellow-400' style={{ fontSize: "45px" }} />
    </div>
  );
};

const Card = ({ img, title, name, description }) => {
  return (
    <div className='flex items-center flex-row text-left text-gray-700 px-5'>
      <Avatar
        imgProps={{ style: { borderRadius: "50%" } }}
        src={img}
        style={{
          width: 120,
          height: 120,
          padding: 7,
          marginBottom: 20,
        }}
      />
      <div className='flex items-left flex-col ml-5'>
        <p>
          {description}
        </p>
        <div className='border-l-4 border-yellow-400 pl-4'>
          <p className='mb-0'>
            <span className="font-semibold">{name}</span>
          </p>
          <p>
            {title}
          </p>
        </div>
        
      </div>
      
    </div>
  );
};

export const Testimonials = ({testimonialData}) => {
    
  const settings = {
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [      
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='testimonial w-full flex justify-center'>
      <div className='text-center mx-auto' style={{width:'90%'}}>
        <Slider className='px-5' {...settings}>
          {testimonialData.map((item, index) => (
            <Card
              key={index}
              img={item.img}
              title={item.title}
              name={item.name}
              description={item.description}              
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};
