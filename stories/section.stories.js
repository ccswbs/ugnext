import { Section } from '@/components/section';

const config = {
  title: 'Components/Section',
  component: Section,
  parameters: {
    layout: 'padded',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    primary: { control: false },
    secondary: { control: false },
  },
};

export default config;

export const Default = {
  args: {
    equal: false,
    primary: <div>Primary content here</div>,
    secondary: <div>Secondary content here</div>,
  },
};

export const EqualWidth = {
  args: {
    equal: true,
    primary: <div>Primary content here</div>,
    secondary: <div>Secondary content here</div>,
  },
};
