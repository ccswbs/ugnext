'use client';

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
import { ProfileBlock } from "@/components/client/widgets/profile-block";
import { ProfileCardWithApi as ProfileCard } from "@/components/client/widgets/profile-card-with-api";

export function WidgetSelector({ data }) {
  
  // If this widget is within a section, we don't want to render a container around it
  const context = useContext(SectionContext);

  // Some widgets need to span the full width of the page
  const noWrapWidgets = ["ParagraphTestimonialSlider", "ParagraphImageOverlay", "ParagraphStoryWidget", "ParagraphProfileBlock"];

  const map = {
    ParagraphAccordionSection: AccordionWidget,
    ParagraphSectionButton: ButtonSectionWidget,
    ParagraphGeneralText: GeneralTextWidget,
    ParagraphLinksWidget: LinksWidget,
    ParagraphMediaText: MediaTextWidget,
    ParagraphTestimonialSlider: TestimonialSliderWidget,
    ParagraphSection: SectionWidget,
    ParagraphSectionTab: TabsWidget,
    ParagraphStatisticWidget: StatisticsWidget,
    ParagraphImageOverlay: ImageOverlayWidget,
    ParagraphStoryWidget: StoryWidget,
    ParagraphBlockWidget: BlockWidget,
    ParagraphProfileBlock: ProfileBlock,
    ParagraphProfileCard: ProfileCard,
  };

  const Widget = map[data.__typename];
  
  return (
    <ConditionalWrap
      condition={!noWrapWidgets.includes(data.__typename) && !context}
      wrap={(children) => <Container>{children}</Container>}
    >
      {Widget && <Widget data={data} />}
    </ConditionalWrap>
  );
}