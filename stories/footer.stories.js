import { Footer } from '@/components/footer';

const config = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'padded',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default config;

export const Default = {
  args: {},
};

export const WithCustomLinks = {
  args: {
    links: [
      {
        href: '/example-page-1',
        text: 'Example Page 1',
      },
      {
        href: '/example-page-2',
        text: 'Example Page 2',
      },
      {
        href: '/example-page-3',
        text: 'Example Page 3',
      },
      {
        href: '/example-page-4',
        text: 'Example Page 4',
      },
    ],
  },
};
