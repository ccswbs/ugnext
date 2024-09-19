import { Breadcrumbs } from "@/components/breadcrumbs";

const config = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "padded",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
};

export default config;

export const Default = {
  args: {
    links: [
      {
        title: "Example Page 1",
        url: "/example-page-1",
      },
      {
        title: "Example Page 2",
        url: "/example-page-2",
      },
    ],
  },
};

export const WithManyCrumbs = {
  args: {
    links: [
      {
        title: "Example Page 1",
        url: "/example-page-1",
      },
      {
        title: "Example Page 2",
        url: "/example-page-2",
      },
      {
        title: "Example Page 3",
        url: "/example-page-3",
      },
      {
        title: "Example Page 4",
        url: "/example-page-4",
      },
      {
        title: "Example Page 5",
        url: "/example-page-5",
      },
      {
        title: "Example Page 6",
        url: "/example-page-6",
      },
      {
        title: "Example Page 7",
        url: "/example-page-7",
      },
    ],
  },
};
