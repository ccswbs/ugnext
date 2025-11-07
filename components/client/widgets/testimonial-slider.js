import React from "react";
import { Carousel } from "@uoguelph/react-components/carousel";
import { Typography } from "@uoguelph/react-components/typography";
import {
  Blockquote,
  BlockquoteContent,
  BlockquoteAuthor,
  BlockquoteAuthorName,
  BlockquoteAuthorTitle,
  BlockquoteAuthorLink,
} from "@uoguelph/react-components/blockquote";
import Link from "next/link";
import { HtmlParser } from "@/components/client/html-parser";
import { Container } from "@uoguelph/react-components/container";
import { useMediaQuery } from "@/lib/use-media-query";
import { MediaCaption } from "@uoguelph/react-components/media-caption";
import { twMerge } from "tailwind-merge";

function TestimonialType(types) {
  const typeList = types.map((testimonialType) => testimonialType.name);
  const allowedTypes = ["Faculty", "Alumni", "Graduate Student", "Undergraduate Student"];
  return allowedTypes.find((type) => typeList.includes(type)) || null;
}

export function TestimonialSliderWidget({ data }) {
  let testimonials = [];
  let numTestimonials = 0;
  const showMultiple = useMediaQuery("only screen and (min-width : 1024px)");

  if (Array.isArray(data?.byTitle)) {
    testimonials = testimonials.concat(data.byTitle);
  }

  if (Array.isArray(data?.byTags)) {
    testimonials = testimonials.concat(data.byTags);
  }

  numTestimonials = testimonials.length;

  return (
    <div id={`testimonial-slider-${data.uuid}`} className="bg-grey-light-bg mb-4">
      <Container
        className={twMerge("px-4 py-10 flex flex-col items-center", numTestimonials === 1 && "lg:w-3/4 xl:w-1/2")}
      >
        {data?.title && (
          <Typography id={`testimonial-slider-heading-${data.uuid}`} type="h2" as="h3" className="mb-12 text-black">
            {data.title}
          </Typography>
        )}

        <Carousel loop="jump" display={showMultiple && numTestimonials > 1 ? 2 : 1}>
          {testimonials.map((testimonial, index) => {
            const image = testimonial?.image?.image;
            const title = testimonial?.name ?? "Anonymous";
            const testimonialType = testimonial?.type && TestimonialType(testimonial?.type);

            return (
              <MediaCaption
                key={testimonial.id}
                position="left"
                size="medium"
                src={image?.url}
                width={image?.width}
                height={image?.height}
                alt={image?.alt}
                className="[&_.uofg-media-caption-media]:rounded-full [&_.uofg-media-caption-media]:aspect-square h-full"
                as="img"
              >
                <Blockquote hideQuotationMarks>
                  <BlockquoteContent className="text-left text-xl">
                    <HtmlParser html={testimonial?.body?.processed} />
                  </BlockquoteContent>

                  <BlockquoteAuthor>
                    <BlockquoteAuthorName className="text-black">
                      {title}
                      {testimonialType ? ", " + testimonialType : ""}
                    </BlockquoteAuthorName>

                    {testimonial?.description && (
                      <BlockquoteAuthorTitle>{testimonial.description}</BlockquoteAuthorTitle>
                    )}

                    {testimonial?.profile && (
                      <BlockquoteAuthorLink href={testimonial.profile.url} as={Link}>
                        {testimonial.profile.title}
                      </BlockquoteAuthorLink>
                    )}
                  </BlockquoteAuthor>
                </Blockquote>
              </MediaCaption>
            );
          })}
        </Carousel>
      </Container>
    </div>
  );
}
