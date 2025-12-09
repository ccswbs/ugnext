"use client";

import background from "@/img/home/johnston-green-background.jpg";
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
import type { HomeStory } from "@/data/yaml/home/stories";

export type HomeStoryProps = {
  firstName: HomeStory["firstName"];
  lastName: HomeStory["lastName"];
  quote: HomeStory["quotes"][number];
  image: HomeStory["image"];
};

export function HomeStory({ firstName, lastName, quote, image }: HomeStoryProps) {
  return (
    <Story>
      <StoryBody>
        <StoryBackground>
          <StoryBackgroundImage
            alt=""
            className="object-cover lg:[object-position:left_20px] brightness-100!"
            src={background.src}
            width={background.width}
            height={background.height}
            blurDataURL={background.blurDataURL}
            as={Image}
          />
        </StoryBackground>
        <StoryForeground>
          <StoryForegroundContent>
            <Blockquote className="text-white pt-[40px]">
              <BlockquoteContent>
                {quote} ~ {firstName} {lastName}
              </BlockquoteContent>
            </Blockquote>
          </StoryForegroundContent>
          <StoryForegroundImage
            alt={image.alt}
            src={image.src}
            width={image.width}
            height={image.height}
            blurDataURL={image.blurDataURL}
            as={Image}
            className="max-w-[40rem]"
          />
        </StoryForeground>
      </StoryBody>
      <StoryFooter>
        <span className="mr-1 text-2xl leading-tight">Learn how real-world education and experience will</span>
        <Button
          as="a"
          id="uofg-homepage-improve-life"
          href="https://www.uoguelph.ca/improve-life/"
          color="red"
          className="py-2! px-4! mx-[.25em] text-2xl! text-center"
        >
          Improve Life
        </Button>
      </StoryFooter>
    </Story>
  );
}
