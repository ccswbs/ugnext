import React from 'react';
import { Carousel } from '@/components/carousel';
import { Heading } from '@/components/heading';
import { Profile } from '@/components/profile';
import { Link } from '@/components/link';

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
      <Heading level={3} as="h2" className="mb-12 text-black">
        Testimonial Slider
      </Heading>
      <Carousel loop="jump" display={2}>
        {testimonials.map((testimonial, index) => (
          <Profile
            key={testimonial.name + index}
            image={testimonial.image}
            body={<blockquote className="italic text-gray-700">{testimonial.quote}</blockquote>}
            footer={
              <>
                <span className="font-bold">{testimonial.name}</span>
                <span className="text-red">{testimonial.description}</span>
                <Link className="w-fit py-0" href={testimonial.link.url} color="blue">
                  {testimonial.link.title}
                </Link>
              </>
            }
          />
        ))}
      </Carousel>
    </div>
  );
};
