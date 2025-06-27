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
    <div className="bg-grey-light-bg pb-7.5">
      <Container className="px-4 py-14 flex flex-col items-center">
        <Typography type="h2" as="h3" className="mb-12 text-black!">
          {data?.title}
        </Typography>

        <Carousel loop="jump" display={showMultiple ? 2 : 1}>
          {testimonials.map((testimonial, index) => {
            const image = testimonial?.image?.image;
            const title = testimonial?.name ?? "Anonymous";

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
                  <BlockquoteContent className="text-left! uog:text-xl">
                    <HtmlParser html={testimonial?.body?.processed} />
                  </BlockquoteContent>

                  <BlockquoteAuthor>
                    <BlockquoteAuthorName>{title}</BlockquoteAuthorName>

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
