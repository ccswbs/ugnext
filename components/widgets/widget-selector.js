import { Accordions } from "@/components/widgets/accordions";
import { ButtonSection } from "@/components/widgets/button-section";
import { GeneralText } from "@/components/widgets/general-text";
import { Links } from "@/components/widgets/links";
import { MediaText } from "@/components/widgets/media-text";
import { Section } from "@/components/widgets/section-widget.js";
import { Statistics } from "@/components/widgets/statistics";
import { Tabs } from "@/components/widgets/tabs";
import { TestimonialSlider } from "@/components/widgets/testimonial-slider";
import ConditionalWrap from "conditional-wrap";
import { Container } from "@uoguelph/react-components/container";
import { useContext } from "react";
import { SectionContext } from "@/components/section";
import { ImageOverlay } from "@/components/widgets/image-overlay";
import { Story } from "@/components/widgets/story";
import { Block } from "@/components/widgets/block";

export const WidgetSelector = ({ data }) => {
  // If this widget is within a section, we don't want to render a container around it
  const context = useContext(SectionContext);

  // Some widgets need to span the full width of the page
  const noWrapWidgets = ["ParagraphTestimonialSlider", "ParagraphImageOverlay", "ParagraphStoryWidget"];

  const map = {
    ParagraphAccordionSection: Accordions,
    ParagraphSectionButton: ButtonSection,
    ParagraphGeneralText: GeneralText,
    ParagraphLinksWidget: Links,
    ParagraphMediaText: MediaText,
    ParagraphTestimonialSlider: TestimonialSlider,
    ParagraphSection: Section,
    ParagraphSectionTab: Tabs,
    ParagraphStatisticWidget: Statistics,
    ParagraphImageOverlay: ImageOverlay,
    ParagraphStoryWidget: Story,
    ParagraphBlockWidget: Block,
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
};
