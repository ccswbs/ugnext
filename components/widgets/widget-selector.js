import { Accordions } from '@/components/widgets/accordions';
import { ButtonSection } from '@/components/widgets/button-section';
import { GeneralText } from '@/components/widgets/general-text';
import { Links } from '@/components/widgets/links';
import { MediaText } from '@/components/widgets/media-text';
import { Section } from '@/components/widgets/section';
import { Statistics } from '@/components/widgets/statistics';
import { Tabs } from '@/components/widgets/tabs';
<<<<<<< HEAD

export const WidgetSelector = ({ data }) => {
  console.log(data);
  switch (data.__typename) {
    case 'ParagraphAccordionSection':
      return <Accordions data={data} />;
    case 'ParagraphSectionButton':
      return <ButtonSection data={data} />;
    case 'ParagraphGeneralText':
      return <GeneralText data={data} />;
    case 'ParagraphLinksWidget':
      return <Links data={data} />;
    case 'ParagraphMediaText':
      return <MediaText data={data} />;
    case 'ParagraphSection':
      return <Section data={data} />;
    case 'ParagraphSectionTab':
      return <Tabs data={data} />;
    case 'ParagraphStatisticWidget':
      return <Statistics data={data} />;
    default:
      return <div>{data.__typename} is not yet implemented</div>;
  }
=======
import { TestimonialSlider } from '@/components/widgets/testimonial-slider';
import ConditionalWrap from 'conditional-wrap';
import { Container } from '@/components/container';
import { useContext } from 'react';
import { SectionContext } from '@/components/section';
import { ImageOverlay } from '@/components/widgets/image-overlay';
import { Story } from '@/components/widgets/story';

export const WidgetSelector = ({ data }) => {
  // If this widget is within a section, we don't want to render a container around it
  const context = useContext(SectionContext);

  // Some widgets need to span the full width of the page
  const noWrapWidgets = ['ParagraphTestimonialSlider', 'ParagraphImageOverlay', 'ParagraphStoryWidget'];

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
  };

  const Widget = map[data.__typename];

  return (
    <ConditionalWrap
      condition={!noWrapWidgets.includes(data.__typename) && !context}
      wrap={(children) => <Container centered={true}>{children}</Container>}
    >
      {Widget && <Widget data={data} />}
    </ConditionalWrap>
  );
>>>>>>> 667fa8c5fadda7e48a42958ea13a726d640af627
};
