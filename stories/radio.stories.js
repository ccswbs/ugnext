import { TextInput } from '@/components/text-input';
import { fn } from '@storybook/test';
import { Radio } from '@/components/radio';

const config = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
  },
};

export default config;

export const Default = {
  args: {
    options: [
      {
        value: 'option-1',
        label: 'Option 1',
      },
      {
        value: 'option-2',
        label: 'Option 2',
      },
      {
        value: 'option-3',
        label: 'Option 3',
      },
    ],
  },
};

export const WithLabel = {
  args: {
    options: [
      {
        value: 'option-1',
        label: 'Option 1',
      },
      {
        value: 'option-2',
        label: 'Option 2',
      },
      {
        value: 'option-3',
        label: 'Option 3',
      },
    ],
    label: 'Example Radio',
  },
};

export const Inline = {
  args: {
    options: [
      {
        value: 'option-1',
        label: 'Option 1',
      },
      {
        value: 'option-2',
        label: 'Option 2',
      },
      {
        value: 'option-3',
        label: 'Option 3',
      },
    ],
    inline: true,
  },
};
