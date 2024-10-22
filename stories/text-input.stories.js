import { TextInput } from "@/components/text-input";
import { fn } from "@storybook/test";

const config = {
  title: "Components/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  args: {
    onInput: fn(),
  },
};

export default config;

export const Default = {
  args: {},
};

export const WithPlaceholder = {
  args: {
    placeholder: "Enter text here",
  },
};

export const WithLabelAndDescription = {
  args: {
    label: "Example TextInput",
    description: "This is an example TextInput",
  },
};

export const Password = {
  args: {
    type: "password",
    placeholder: "Enter password here",
  },
};
