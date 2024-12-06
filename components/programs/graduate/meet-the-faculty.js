import React, { useEffect, useRef, useState } from "react";
import { Heading } from "@/components/heading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { twJoin, twMerge } from "tailwind-merge";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

const PreviousBtn = (props) => {
  const { className, onClick, displayType } = props;
  return (
    <div
      className={twMerge(
        twJoin(
          `z-10 ${displayType === "col" ? "!top-auto !right-20 bottom-0 my-0 mx-auto sm:top-1/2 sm:right-auto sm:bottom-auto" : ""}`
        ),
        className
      )}
      onClick={onClick}
      style={{ top: "33%", left: "0px" }}
    >
      <ArrowBackIos className="text-yellow-400  hover:text-black" style={{ fontSize: "45px" }} />
    </div>
  );
};

const NextBtn = (props) => {
  const { className, onClick, displayType } = props;
  return (
    <div
      className={twMerge(
        twJoin(
          `z-10 ${displayType === "col" ? "!top-auto !left-20 bottom-0 my-0 mx-auto sm:top-1/2 sm:left-auto sm:bottom-auto" : ""}`
        ),
        className
      )}
      onClick={onClick}
      style={{ top: "33%", right: "10px" }}
    >
      <ArrowForwardIos className="text-yellow-400 hover:text-black" style={{ fontSize: "45px" }} />
    </div>
  );
};

const Card = ({ img, title, name, description, displayType }) => {
  const imgRef = useRef(null); // Reference for the image
  const [parentHeight, setParentHeight] = useState("auto"); // Initial height for the parent container

  useEffect(() => {
    // Function to set the parent height based on the image height
    const setHeight = () => {
      if (imgRef.current) {
        const imgHeight = imgRef.current.offsetHeight + 1; // Get the height of the image
        setParentHeight(`${imgHeight}px`); // Set the parent height
      }
    };

    setHeight(); // Set height on mount

    // Optional: Recalculate height on window resize
    window.addEventListener("resize", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight); // Cleanup listener
    };
  }, [img]); // Run effect when the img prop changes

  return (
    <div
      className={`group flex items-center ${
        displayType === "col" ? "flex-col hover:bg-yellow-400" : "flex-row"
      } text-left text-gray-700 mx-2 mb-5 sm:mb-auto overflow-hidden`}
    >
      <div
        style={{
          ...(displayType === "col" && {
            height: parentHeight,
            overflow: "hidden",
          }),
        }}
      >
        <Image
          imgProps={displayType !== "col" ? { style: { borderRadius: "50%" } } : {}}
          src={img.src}
          width={img.width}
          height={img.height}
          ref={imgRef} // Attach the ref to the image element
          style={{
            borderRadius: displayType === "col" ? 0 : "50%",
            width: displayType === "col" ? "100%" : 120,
            height: displayType === "col" ? parentHeight : 120,
          }}
          className={`${displayType === "col" ? "transition-transform duration-200 ease-in-out group-hover:scale-110 object-cover" : "mx-2"} `}
          alt={img.alt}
        />
      </div>
      <div className={`${displayType === "col" ? "w-full" : ""} flex items-left flex-col ml-51`}>
        {displayType === "col" ? (
          <div className="p-2">
            {/* Title Section First */}
            <div>
              <p className="mb-0">
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
            <div className="border-l-4 border-yellow-400 pl-4">
              <p className="mb-0">
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

const Testimonials = ({ testimonialData, slideNum, displayType = "row" }) => {
  const settings = {
    prevArrow: <PreviousBtn displayType={displayType} />,
    nextArrow: <NextBtn displayType={displayType} />,
    dots: false,
    slidesToShow: slideNum,
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
      <div className="text-center mx-auto md:px-5" style={{ width: "90%" }}>
        <Slider className="px-5" {...settings}>
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

export const MeetTheFaculty = ({ data }) => {
  const displayType = data.setting.displayType;

  return (
    <div className="ug-testimonial text-center bg-grey-light py-10">
      <Heading
        className={`text-red mx-auto md:px-5 ${displayType === "col" ? "sm:text-left" : ""}`}
        level={data.heading.level}
      >
        {data.heading.title}
      </Heading>
      <Testimonials testimonialData={data.testimonialData} slideNum={data.setting.slideNum} displayType={displayType} />
    </div>
  );
};
