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
import type { StoryData } from "@/data/yaml/home/stories";
import { twJoin } from "tailwind-merge";

export function HomeStory({ data }: { data: StoryData }) {
  const longQuote = data.quote.length > 300;

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
              <BlockquoteContent className={twJoin("inline", longQuote && "text-2xl")}>{data.quote}</BlockquoteContent>
              <span className={twJoin("italic", !longQuote && "text-3xl", longQuote && "text-2xl")}>
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
          href="https://www.uoguelph.ca/improve-your-life"
          color="red"
          className="py-2! px-4! mx-[.25em] text-2xl! text-center"
        >
          Improve Your Life
        </Button>
      </StoryFooter>
    </Story>
  );
}
