import { Carousel } from "@/components/carousel";

const config = {
  title: "Components/Carousel",
  component: Carousel,
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
    display: 1,
    loop: "none",
    children: [
      <div key="test-1" className="flex justify-center items-center border-2 h-96">
        Carousel Item 1
      </div>,
      <div key="test-2" className="flex justify-center items-center border-2 h-96">
        Carousel Item 2
      </div>,
      <div key="test-3" className="flex justify-center items-center border-2 h-96">
        Carousel Item 3
      </div>,
      <div key="test-4" className="flex justify-center items-center border-2 h-96">
        Carousel Item 4
      </div>,
      <div key="test-5" className="flex justify-center items-center border-2 h-96">
        Carousel Item 5
      </div>,
      <div key="test-6" className="flex justify-center items-center border-2 h-96">
        Carousel Item 6
      </div>,
      <div key="test-7" className="flex justify-center items-center border-2 h-96">
        Carousel Item 7
      </div>,
    ],
  },
};

export const MultipleItemsDisplayed = {
  args: {
    display: 2,
    loop: "none",
    children: [
      <div key="test-1" className="flex justify-center items-center border-2 h-96">
        Carousel Item 1
      </div>,
      <div key="test-2" className="flex justify-center items-center border-2 h-96">
        Carousel Item 2
      </div>,
      <div key="test-3" className="flex justify-center items-center border-2 h-96">
        Carousel Item 3
      </div>,
      <div key="test-4" className="flex justify-center items-center border-2 h-96">
        Carousel Item 4
      </div>,
      <div key="test-5" className="flex justify-center items-center border-2 h-96">
        Carousel Item 5
      </div>,
      <div key="test-6" className="flex justify-center items-center border-2 h-96">
        Carousel Item 6
      </div>,
      <div key="test-7" className="flex justify-center items-center border-2 h-96">
        Carousel Item 7
      </div>,
    ],
  },
};

export const JumpLoop = {
  args: {
    display: 2,
    loop: "jump",
    children: [
      <div key="test-1" className="flex justify-center items-center border-2 h-96">
        Carousel Item 1
      </div>,
      <div key="test-2" className="flex justify-center items-center border-2 h-96">
        Carousel Item 2
      </div>,
      <div key="test-3" className="flex justify-center items-center border-2 h-96">
        Carousel Item 3
      </div>,
      <div key="test-4" className="flex justify-center items-center border-2 h-96">
        Carousel Item 4
      </div>,
      <div key="test-5" className="flex justify-center items-center border-2 h-96">
        Carousel Item 5
      </div>,
      <div key="test-6" className="flex justify-center items-center border-2 h-96">
        Carousel Item 6
      </div>,
      <div key="test-7" className="flex justify-center items-center border-2 h-96">
        Carousel Item 7
      </div>,
    ],
  },
};

export const ContinuousLoop = {
  args: {
    display: 3,
    loop: "continuous",
    children: [
      <div key="test-1" className="flex justify-center items-center border-2 h-96">
        Carousel Item 1
      </div>,
      <div key="test-2" className="flex justify-center items-center border-2 h-96">
        Carousel Item 2
      </div>,
      <div key="test-3" className="flex justify-center items-center border-2 h-96">
        Carousel Item 3
      </div>,
      <div key="test-4" className="flex justify-center items-center border-2 h-96">
        Carousel Item 4
      </div>,
      <div key="test-5" className="flex justify-center items-center border-2 h-96">
        Carousel Item 5
      </div>,
      <div key="test-6" className="flex justify-center items-center border-2 h-96">
        Carousel Item 6
      </div>,
      <div key="test-7" className="flex justify-center items-center border-2 h-96">
        Carousel Item 7
      </div>,
    ],
  },
};
