import { Header } from "@/components/header";

const config = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
};

export default config;

export const Default = {
  args: {},
};

export const WithMenu = {
  args: {
    menu: [
      {
        url: "/example-page-1",
        title: "Example Link 1",
      },
      {
        url: "/example-page-2",
        title: "Example Link 2",
      },
      {
        url: "/example-page-3",
        title: "Example Link 3",
      },
      {
        title: "Example Dropdown",
        children: [
          {
            url: "/example-page-4",
            title: "Example Link 4",
          },
          {
            url: "/example-page-5",
            title: "Example Link 5",
          },
          {
            url: "/example-page-6",
            title: "Example Link 6",
          },
        ],
      },
    ],
  },
};
