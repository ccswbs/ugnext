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

export const Testimonials = () => {
  const testimonial_data = [
    {
      img: "https://www.tutorialrepublic.com/examples/images/clients/1.jpg",
      title: 'Professor, Department of Biostatics',
      name: 'Dr. Gwendolyn Patterson',
      description: '1st Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
    },
    {
      img: "https://www.tutorialrepublic.com/examples/images/clients/2.jpg",
      title: 'Professor, Department of Biostatics',
      name: 'Dr. Montgomery Smith',
      description: '2nd Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
    },
    {
      img: "https://www.tutorialrepublic.com/examples/images/clients/3.jpg",
      title: 'Professor, Department of Biostatics',
      name: 'Dr. Ryan D',
      description: '3rd Phasellus vitae suscipit justo. Mauris pharetra feugiat ante id lacinia. Etiam faucibus mauris id tempor egestas. Duis luctus turpis at accumsan tincidunt. Phasellus risus risus, volutpat vel tellus ac, tincidunt fringilla massa. Etiam hendrerit dolor eget rutrum'
    }
  ];
  
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
          {testimonial_data.map((item, index) => (
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
