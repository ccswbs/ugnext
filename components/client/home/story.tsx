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
import type { ActiveStoryData } from "@/data/yaml/home/stories";

export function HomeStory({ data }: { data: ActiveStoryData }) {
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
            <Blockquote className="inline text-center text-white pt-[40px]">
              <BlockquoteContent className="inline">{data.quote}</BlockquoteContent>
              <span className="text-3xl">
                {" "}
                - {data.firstName} {data.lastName} {data.title && `, ${data.title}`}
              </span>
            </Blockquote>
          </StoryForegroundContent>
          <StoryForegroundImage
            alt={data.image.alt}
            src={data.image.src}
            width={data.image.width}
            height={data.image.height}
            blurDataURL={data.image.blurDataURL}
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
          Improve Your Life
        </Button>
      </StoryFooter>
    </Story>
  );
}
