import { Link } from '@/components/link';

const config = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
};

export default config;

export const Blue = {
  args: {
    children: 'Example Link',
    href: '/example-page',
    color: 'blue',
  },
};

export const Red = {
  args: {
    children: 'Example Link',
    href: '/example-page',
    color: 'red',
  },
};

export const Yellow = {
  args: {
    children: 'Example Link',
    href: '/example-page',
    color: 'yellow',
  },
};

export const Green = {
  args: {
    children: 'Example Link',
    href: '/example-page',
    color: 'green',
  },
};

export const Grey = {
  args: {
    children: 'Example Link',
    href: '/example-page',
    color: 'grey',
  },
};
