import { Footer } from "@/components/footer";

const config = {
  title: "Components/Footer",
  component: Footer,
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

export const WithSubFooter = {
  args: {
    subFooter: {
      image: {
        src: "https://api.liveugconthub.uoguelph.dev/sites/default/files/2022-02/OntarioVeterinaryCollege_version1_Full%20Colour_OVC%20%281%29.png",
        height: 150,
        width: 400,
        alt: "Placeholder",
      },
      content: "This is the sub footer content.",
    },
  },
};

export const RidgetownVariant = {
  args: {
    variant: "ridgetown",
  },
};
