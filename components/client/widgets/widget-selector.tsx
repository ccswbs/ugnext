"use client";

import ConditionalWrap from "conditional-wrap";
import { Container } from "@uoguelph/react-components/container";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import { AccordionWidget } from "@/components/client/widgets/accordions";
import { ButtonSectionWidget } from "@/components/client/widgets/button-section";
import { GeneralTextWidget } from "@/components/client/widgets/general-text";
import { LinksWidget } from "@/components/client/widgets/links";
import { MediaTextWidget } from "@/components/client/widgets/media-text";
import { SectionWidget } from "@/components/client/widgets/section.js";
import { StatisticsWidget } from "@/components/client/widgets/statistics";
import { ImageOverlayWidget } from "@/components/client/widgets/image-overlay";
import { StoryWidget } from "@/components/client/widgets/story";
import { BlockWidget } from "@/components/client/widgets/block";
import { TabsWidget } from "@/components/client/widgets/tabs";
import { TestimonialSliderWidget } from "@/components/client/widgets/testimonial-slider";
import { SocialMediaWidget } from "@/components/client/widgets/social-media";
import type { Widgets } from "@/data/drupal/widgets";

export function WidgetSelector({ data }: { data: Widgets }) {
  // If this widget is within a section, we don't want to render a container around it
  const context = useContext(SectionContext);

  // Some widgets need to span the full width of the page
  const noWrapWidgets = ["ParagraphTestimonialSlider", "ParagraphImageOverlay", "ParagraphStoryWidget"];

  const Widget = () => {
    switch (data.__typename) {
      case "ParagraphAccordionSection":
        return <AccordionWidget data={data} />;
      case "ParagraphSectionButton":
        return <ButtonSectionWidget data={data} />;
      case "ParagraphGeneralText":
        return <GeneralTextWidget data={data} />;
      case "ParagraphLinksWidget":
        return <LinksWidget data={data} />;
      case "ParagraphMediaText":
        return <MediaTextWidget data={data} />;
      case "ParagraphTestimonialSlider":
        return <TestimonialSliderWidget data={data} />;
      case "ParagraphSection":
        return <SectionWidget data={data} />;
      case "ParagraphSectionTab":
        return <TabsWidget data={data} />;
      case "ParagraphStatisticWidget":
        return <StatisticsWidget data={data} />;
      case "ParagraphImageOverlay":
        return <ImageOverlayWidget data={data} />;
      case "ParagraphStoryWidget":
        return <StoryWidget data={data} />;
      case "ParagraphBlockWidget":
        return <BlockWidget data={data} />;
      case "ParagraphSocialMediaWidget":
        return <SocialMediaWidget data={data} />;
      default:
        console.error(`Widget Error ${data.__typename}: Widget type is not supported`, data);
        return <></>;
    }
  };

  return (
    <ConditionalWrap
      condition={!noWrapWidgets.includes(data.__typename) && !context}
      wrap={(children) => <Container>{children}</Container>}
    >
      {<Widget />}
    </ConditionalWrap>
  );
}
