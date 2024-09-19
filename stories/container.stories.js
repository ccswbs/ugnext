import { Container } from "@/components/container";

const config = {
  title: "Components/Container",
  component: Container,
  parameters: {
    layout: "padded",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
};

export default config;

export const Default = {
  args: {
    centered: false,
    children: <div>Whatever content you want here</div>,
  },
};

export const Centered = {
  args: {
    centered: true,
    children: <div>Whatever content you want here</div>,
  },
};
