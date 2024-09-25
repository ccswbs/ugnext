import { Footer } from "@/components/footer";

const config = {
  title: "Components/Footer",
  component: Footer,
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
  args: {},
};

export const WithCustomLinks = {
  args: {
    links: [
      {
        url: "/example-page-1",
        title: "Example Page 1",
      },
      {
        url: "/example-page-2",
        title: "Example Page 2",
      },
      {
        url: "/example-page-3",
        title: "Example Page 3",
      },
      {
        url: "/example-page-4",
        title: "Example Page 4",
      },
    ],
  },
};

export const RidgetownVariant = {
  args: {
    variant: 'ridgetown'
  },
};