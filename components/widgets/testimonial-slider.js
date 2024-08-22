import React from 'react';
import { Carousel } from '@/components/carousel';
import { Heading } from '@/components/heading';
import { Profile } from '@/components/profile';
import { Link } from '@/components/link';
import { HtmlParser } from '@/components/html-parser';

export const TestimonialSlider = ({ data }) => {
  let testimonials = [];

  if (Array.isArray(data?.byTitle)) {
    testimonials = testimonials.concat(data.byTitle);
  }

  if (Array.isArray(data?.byTags)) {
    testimonials = testimonials.concat(data.byTags);
  }

  return (
    <div className="px-10 py-14 bg-gray-100 flex flex-col items-center">
      <Heading level={2} className="mb-12 text-black">
        {data?.title}
      </Heading>
      <Carousel loop="jump" display={2}>
        {testimonials.map((testimonial, index) => {
          const image = testimonial?.image.image;
          const title = testimonial?.type ? `${testimonial.title}, ${testimonial.type[0].name}` : testimonial.title;

          return (
            <Profile
              key={testimonial.id}
              image={{
                src: image?.url,
                width: image?.width,
                height: image?.height,
                alt: image?.alt,
              }}
              body={
                <blockquote className="italic text-gray-700 text-xl">
                  <HtmlParser html={testimonial?.body?.processed} />
                </blockquote>
              }
              footer={
                <>
                  <span className="font-bold text-lg">{title}</span>
                  {testimonial?.description && <span className="text-red text-lg">{testimonial.description}</span>}
                  {testimonial?.profile && (
                    <Link className="w-fit py-0 text-lg" href={testimonial.profile.url} color="blue">
                      {testimonial.profile.title}
                    </Link>
                  )}
                </>
              }
            />
          );
        })}
      </Carousel>
    </div>
  );
};
