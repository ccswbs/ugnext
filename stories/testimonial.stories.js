import { Testimonial } from '@/components/testimonial';

const config = {
  title: 'Components/Testimonial',
  component: Testimonial,
  parameters: {
    layout: 'centered',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default config;

export const Default = {
  args: {
    name: 'John Doe, Example',
    quote: 'Itaque possimus amet quo fugiat in cumque. Dolores ipsa neque adipisci dolores architecto voluptas omnis quibusdam. Accusantium sunt atque rem modi. Nesciunt cupiditate cum consectetur repellat vero. Deleniti accusamus porro. Aperiam ipsam placeat commodi laborum inventore amet.',
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
    }
  },
};
