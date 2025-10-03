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

function TestimonialType(types) {  
  const typeList = types.map(testimonialType => testimonialType.name);
  const allowedTypes = ['Faculty', 'Alumni', 'Graduate Student', 'Undergraduate Student'];
  const type = allowedTypes.find(type => typeList.includes(type)) || null;
  return type;
}

export function TestimonialSliderWidget({ data }) {
  let testimonials = [];
  const showMultiple = useMediaQuery("only screen and (min-width : 1024px)");

  if (Array.isArray(data?.byTitle)) {
    testimonials = testimonials.concat(data.byTitle);
  }

  if (Array.isArray(data?.byTags)) {
    testimonials = testimonials.concat(data.byTags);
  }

  return (
    <div className="bg-grey-light-bg mb-4">
      <Container className="px-4 py-10 flex flex-col items-center">
        {data?.title && <Typography type="h2" as="h3" className="mb-12 text-black">
          {data.title}
        </Typography>}

        <Carousel loop="jump" display={showMultiple && testimonials.length > 1 ? 2 : 1}>
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
                    <BlockquoteAuthorName className="text-black">{title}{testimonialType ? ', ' + testimonialType : '' }</BlockquoteAuthorName>

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
