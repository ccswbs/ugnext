import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { Carousel } from '@/components/carousel';
import { Testimonial } from '@/components/testimonial';
import { Heading } from '@/components/heading';

export const TestimonialSlider = ({ data }) => {
  const testimonials = [
    {
      name: 'John Doe, Example',
      quote:
        'Itaque possimus amet quo fugiat in cumque. Dolores ipsa neque adipisci dolores architecto voluptas omnis quibusdam. Accusantium sunt atque rem modi. Nesciunt cupiditate cum consectetur repellat vero. Deleniti accusamus porro. Aperiam ipsam placeat commodi laborum inventore amet.',
      description: 'Example Description',
      link: {
        title: 'Example Link',
        url: 'https://usage.co.uk',
      },
      image: {
        width: 150,
        height: 150,
        src: 'https://picsum.photos/seed/hero/150/150',
        alt: 'Example Image',
      },
    },
    {
      name: 'John Doe, Example',
      quote:
        'Itaque possimus amet quo fugiat in cumque. Dolores ipsa neque adipisci dolores architecto voluptas omnis quibusdam. Accusantium sunt atque rem modi. Nesciunt cupiditate cum consectetur repellat vero. Deleniti accusamus porro. Aperiam ipsam placeat commodi laborum inventore amet.',
      description: 'Example Description',
      link: {
        title: 'Example Link',
        url: 'https://usage.co.uk',
      },
      image: {
        width: 150,
        height: 150,
        src: 'https://picsum.photos/seed/hero/150/150',
        alt: 'Example Image',
      },
    },
    {
      name: 'John Doe, Example',
      quote:
        'Itaque possimus amet quo fugiat in cumque. Dolores ipsa neque adipisci dolores architecto voluptas omnis quibusdam. Accusantium sunt atque rem modi. Nesciunt cupiditate cum consectetur repellat vero. Deleniti accusamus porro. Aperiam ipsam placeat commodi laborum inventore amet.',
      description: 'Example Description',
      link: {
        title: 'Example Link',
        url: 'https://usage.co.uk',
      },
      image: {
        width: 150,
        height: 150,
        src: 'https://picsum.photos/seed/hero/150/150',
        alt: 'Example Image',
      },
    },
  ];

  return (
    <div className="px-10 py-14 bg-gray-100 flex flex-col items-center">
      <Heading level={3} as="h2" className="mb-12 text-black">Testimonial Slider</Heading>
      <Carousel loop="jump" display={2}>
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={testimonial.name + index}
            image={testimonial.image}
            quote={testimonial.quote}
            name={testimonial.name}
            description={testimonial.description}
            title={testimonial.title}
          />
        ))}
      </Carousel>
    </div>
  );
};
