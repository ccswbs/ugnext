import { Heading } from "@/components/heading";

const config = {
  title: "Components/Heading",
  component: Heading,
  parameters: {
    layout: "padded",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
    className: { control: false },
  },
};

export default config;

export const H1 = {
  name: "H1",
  args: {
    level: 1,
    children: "Example H1 heading",
  },
};

export const H2 = {
  name: "H2",
  args: {
    level: 2,
    children: "Example H2 heading",
  },
};

export const H3 = {
  name: "H3",
  args: {
    level: 3,
    children: "Example H3 heading",
  },
};

export const H4 = {
  name: "H4",
  args: {
    level: 4,
    children: "Example H4 heading",
  },
};

export const H5 = {
  name: "H5",
  args: {
    level: 5,
    children: "Example H5 heading",
  },
};

export const H6 = {
  name: "H6",
  args: {
    level: 6,
    children: "Example H6 heading",
  },
};

export const H3StylesAsH1 = {
  name: "H3 Styles As H1",
  args: {
    level: 3,
    children: "Example H1 heading with H3 styles",
    as: "h1",
  },
};
