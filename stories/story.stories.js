import foreground from "@/img/meal-care-students.png";
import background from "@/img/change-happens-banner.jpg";
import { Blockquote } from "@/components/blockquote";
import { Story } from "@/components/story";

const config = {
  title: "Components/Story",
  component: Story,
  parameters: {
    layout: "fullScreen",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
  argTypes: {
    content: { control: false },
    footer: { control: false },
  },
};

export default config;

export const Default = {
  args: {
    foregroundImage: {
      src: foreground.src,
      width: foreground.width,
      height: foreground.height,
      alt: "Kiana Gibson and David Sahai, co-founders of MealCare Guelph",
    },
    backgroundImage: {
      src: background.src,
      width: background.width,
      height: background.height,
      alt: "tudent volunteers",
      className: "h-full w-full object-cover lg:[object-position:left_40px]",
    },
    content: (
      <Blockquote className="text-white">
        Quis cum cupiditate adipisci dolores aliquam ullam incidunt tempore nesciunt.
      </Blockquote>
    ),
  },
};

export const WithFooter = {
  args: {
    foregroundImage: {
      src: foreground.src,
      width: foreground.width,
      height: foreground.height,
      alt: "Kiana Gibson and David Sahai, co-founders of MealCare Guelph",
    },
    backgroundImage: {
      src: background.src,
      width: background.width,
      height: background.height,
      alt: "tudent volunteers",
      className: "h-full w-full object-cover lg:[object-position:left_40px]",
    },
    content: (
      <Blockquote className="text-white">
        Quis cum cupiditate adipisci dolores aliquam ullam incidunt tempore nesciunt.
      </Blockquote>
    ),
    footer: "Vero cupiditate deserunt nemo.",
  },
};
