import React from 'react';
import { Heading } from '@/components/heading';
import { Testimonials } from '@/components/testimonial';

export const MeetFaculty = ({ data }) => {
  return (
    <div className="ug-testimonial text-center bg-grey-light py-10">
      <Heading className="" level={data.heading.level}>
        {data.heading.title}
      </Heading>
      <Testimonials
        testimonialData={data.testimonialData}
        slideNum={data.setting.slideNum}
        displayType={data.setting.displayType}
      />
    </div>
  );
};