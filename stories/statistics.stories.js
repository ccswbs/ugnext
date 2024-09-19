import { Statistics } from "@/components/statistics";
import { Link } from "@/components/link";

const config = {
  title: "Components/Statistics",
  component: Statistics,
  parameters: {
    layout: "padded",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
};

export default config;

export const GradientOfSolidColors = {
  args: {
    data: [
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 1 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 2 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 3 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 4 Value",
      },
    ],
    variant: "gradient-of-solid-colors",
  },
};

export const SolidColors = {
  args: {
    data: [
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 1 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 2 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 3 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 4 Value",
      },
    ],
    variant: "solid-colors",
  },
};

export const SolidColorsWithNoGap = {
  args: {
    data: [
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 1 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 2 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 3 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 4 Value",
      },
    ],
    variant: "solid-colors-no-gap",
  },
};

export const LightBlue = {
  args: {
    data: [
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 1 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 2 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 3 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 4 Value",
      },
    ],
    variant: "light-blue",
  },
};

export const LeftBorder = {
  args: {
    data: [
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 1 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 2 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 3 Value",
      },
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 4 Value",
      },
    ],
    variant: "left-border",
  },
};

export const WithImages = {
  args: {
    data: [
      {
        represents: "Statistics 1 Represents",
        value: "Statistics 1 Value",
        image: {
          src: "https://picsum.photos/seed/first/300/200",
          height: 200,
          width: 300,
          alt: "Placeholder image",
        },
      },
      {
        represents: "Statistics 2 Represents",
        value: "Statistics 2 Value",
        image: {
          src: "https://picsum.photos/seed/second/300/200",
          height: 200,
          width: 300,
          alt: "Placeholder image",
        },
      },
      {
        represents: "Statistics 3 Represents",
        value: "Statistics 3 Value",
        image: {
          src: "https://picsum.photos/seed/third/300/200",
          height: 200,
          width: 300,
          alt: "Placeholder image",
        },
      },
      {
        represents: "Statistics 4 Represents",
        value: "Statistics 4 Value",
        image: {
          src: "https://picsum.photos/seed/fourth/300/200",
          height: 200,
          width: 300,
          alt: "Placeholder image",
        },
      },
    ],
    variant: "solid-colors",
  },
};
