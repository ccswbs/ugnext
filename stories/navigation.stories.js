import { Navigation } from '@/components/navigation';

const config = {
  title: 'Components/Navigation',
  component: Navigation,
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
  args: {
    links: [
      {
        href: '/example-page-1',
        label: 'Example Page 1',
      },
      {
        href: '/example-page-2',
        label: 'Example Page 2',
      },
      {
        href: '/example-page-3',
        label: 'Example Page 3',
      },
      {
        href: '/example-page-4',
        label: 'Example Page 4',
      },
    ],
    label: 'Example Navigation',
    fullWidth: false,
  },
};

export const FullWidth = {
  args: {
    links: [
      {
        href: '/example-page-1',
        label: 'Example Page 1',
      },
      {
        href: '/example-page-2',
        label: 'Example Page 2',
      },
      {
        href: '/example-page-3',
        label: 'Example Page 3',
      },
      {
        href: '/example-page-4',
        label: 'Example Page 4',
      },
    ],
    fullWidth: true,
    label: 'Example Navigation',
  },
};
