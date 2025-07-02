import ConditionalWrap from "conditional-wrap";
import { Container } from "@uoguelph/react-components/container";
import { useContext } from "react";
import { SectionContext } from "@/components/section";
import { AccordionWidget } from "@/components/widgets/accordions";
import { ButtonSectionWidget } from "@/components/widgets/button-section";
import { GeneralTextWidget } from "@/components/widgets/general-text";
import { LinksWidget } from "@/components/widgets/links";
import { MediaTextWidget } from "@/components/widgets/media-text";
import { SectionWidget } from "@/components/widgets/section.js";
import { StatisticsWidget } from "@/components/widgets/statistics";
import { ImageOverlayWidget } from "@/components/widgets/image-overlay";
import { StoryWidget } from "@/components/widgets/story";
import { BlockWidget } from "@/components/widgets/block";
import { TabsWidget } from "@/components/widgets/tabs";
import { TestimonialSliderWidget } from "@/components/widgets/testimonial-slider";

export function WidgetSelector({ data }) {
  // If this widget is within a section, we don't want to render a container around it
  const context = useContext(SectionContext);

  // Some widgets need to span the full width of the page
  const noWrapWidgets = ["ParagraphTestimonialSlider", "ParagraphImageOverlay", "ParagraphStoryWidget"];

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
