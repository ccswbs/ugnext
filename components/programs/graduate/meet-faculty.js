import React from "react";
import { Heading } from "@/components/heading";
import { Testimonials } from "@/components/testimonial";

export const MeetFaculty = ({ data }) => {
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
