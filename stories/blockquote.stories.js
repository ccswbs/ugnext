import { Blockquote } from "@/components/blockquote";

const config = {
  title: "Components/Blockquote",
  component: Blockquote,
  parameters: {
    layout: "centered",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
};

export default config;

export const Yellow = {
  args: {
    children: "Quis cum cupiditate adipisci dolores aliquam ullam incidunt tempore nesciunt.",
    color: "yellow",
  },
};

export const Red = {
  args: {
    children: "Quis cum cupiditate adipisci dolores aliquam ullam incidunt tempore nesciunt.",
    color: "red",
  },
};
