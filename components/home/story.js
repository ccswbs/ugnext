import foreground from "@/img/asha-edwin.png";
import background from "@/img/change-happens-banner.jpg";
import { Story } from "@/components/story";
import { Button } from "@/components/button";
import { Blockquote } from "@/components/blockquote";

export const HomeStory = () => (
  <>
    <Story
      foregroundImage={{
        src: foreground.src,
        width: foreground.width,
        height: foreground.height,
        blurred: foreground.blurDataURL,
        alt: "Asha Edwin smiling",
        className: "h-[390px] w-auto object-fit",
      }}
      backgroundImage={{
        src: background.src,
        width: background.width,
        height: background.height,
        blurred: background.blurDataURL,
        alt: "Student volunteers",
        className: "h-full w-full object-cover lg:[object-position:left_20px]",
      }}
      content={
        <Blockquote className="text-white pt-[40px]">
          Pieces of experiential learning allow an opportunity for students to engage with their community, beyond the
          academic sphere, and for me that became pivotal...in shaping my life. ~ Asha Edwin, BA &apos;21
        </Blockquote>
      }
      footer={
        <div className="flex items-center justify-center">
          <span className="mr-1 text-2xl leading-tight">Learn how real-world education and experience will</span>
          <Button color="red" className="py-2 px-4 mx-[.25em] text-2xl">
            Improve Life
          </Button>
        </div>
      }
    />

    <div className="w-full p-2"></div>
  </>
);
