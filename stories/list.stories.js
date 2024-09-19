import { Accordion } from "@/components/accordion";
import { List, ListItem } from "@/components/list";

const config = {
  title: "Components/List",
  component: List,
  parameters: {
    layout: "centered",
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

export const UnorderedList = {
  args: {
    variant: "unordered",
    children: (
      <>
        <ListItem>Example List Item 1</ListItem>
        <ListItem>Example List Item 2</ListItem>
        <ListItem>Example List Item 3</ListItem>
        <ListItem>Example List Item 4</ListItem>
        <ListItem>Example List Item 5</ListItem>
      </>
    ),
  },
};

export const OrderedList = {
  args: {
    variant: "ordered",
    children: (
      <>
        <ListItem>Example List Item 1</ListItem>
        <ListItem>Example List Item 2</ListItem>
        <ListItem>Example List Item 3</ListItem>
        <ListItem>Example List Item 4</ListItem>
        <ListItem>Example List Item 5</ListItem>
      </>
    ),
  },
};
