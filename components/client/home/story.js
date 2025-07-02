"use client";

import foreground from "@/img/asha-edwin.png";
import background from "@/img/change-happens-banner.jpg";
import {
  Story,
  StoryBackground,
  StoryBody,
  StoryForeground,
  StoryForegroundImage,
  StoryBackgroundImage,
  StoryForegroundContent,
  StoryFooter,
} from "@uoguelph/react-components/story";
import { Button } from "@uoguelph/react-components/button";
import { Blockquote, BlockquoteContent } from "@uoguelph/react-components/blockquote";
import Image from "next/image";

export const HomeStory = () => {
  return (
    <Story>
      <StoryBody>
        <StoryBackground>
          <StoryBackgroundImage
            alt="Student volunteers"
            className="object-cover lg:[object-position:left_20px] brightness-100!"
            src={background}
            as={Image}
          />
        </StoryBackground>
        <StoryForeground>
          <StoryForegroundContent>
            <Blockquote className="text-white pt-[40px]">
              <BlockquoteContent>
                Pieces of experiential learning allow an opportunity for students to engage with their community, beyond
                the academic sphere, and for me that became pivotal...in shaping my life. ~ Asha Edwin, BA &apos;21
              </BlockquoteContent>
            </Blockquote>
          </StoryForegroundContent>
          <StoryForegroundImage alt="Asha Edwin smiling" src={foreground} as={Image} className="max-w-[40rem]" />
        </StoryForeground>
      </StoryBody>
      <StoryFooter>
        <span className="mr-1 text-2xl leading-tight">Learn how real-world education and experience will</span>
        <Button
          as="a"
          href="https://www.uoguelph.ca/improve-life/"
          color="red"
          className="py-2! px-4! mx-[.25em] text-2xl! text-center"
        >
          Improve Life
        </Button>
      </StoryFooter>
    </Story>
  );
};
