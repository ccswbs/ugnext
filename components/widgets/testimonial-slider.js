import React from 'react';
import { Carousel } from '@/components/carousel';
import { Heading } from '@/components/heading';
import { Profile } from '@/components/profile';
import { Link } from '@/components/link';
import { HtmlParser } from '@/components/html-parser';
import { Container } from '@/components/container';

export const TestimonialSlider = ({ data }) => {
  let testimonials = [];

  if (Array.isArray(data?.byTitle)) {
    testimonials = testimonials.concat(data.byTitle);
  }

  if (Array.isArray(data?.byTags)) {
    testimonials = testimonials.concat(data.byTags);
  }

  return (
    <div className="bg-gray-100">
      <Container className="px-4 py-14 flex flex-col items-center" centered={true}>
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
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-lg">{title}</span>
                    {testimonial?.description && <span className="text-red text-lg">{testimonial.description}</span>}
                    {testimonial?.profile && (
                      <Link className="w-fit py-0 text-lg" href={testimonial.profile.url} color="blue">
                        {testimonial.profile.title}
                      </Link>
                    )}
                  </div>
                }
              />
            );
          })}
        </Carousel>
      </Container>
    </div>
  );
};
