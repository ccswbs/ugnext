import { Accordions } from '@/components/widgets/accordions';
import { ButtonSection } from '@/components/widgets/button-section';
import { GeneralText } from '@/components/widgets/general-text';
import { Links } from '@/components/widgets/links';
import { MediaText } from "@/components/widgets/mediaText";
import { Section } from '@/components/widgets/section';
import { Statistics } from '@/components/widgets/statistics';
import { Tabs } from '@/components/widgets/tabs';

export const WidgetSelector = ({ data }) => {
  switch (data.__typename) {
    case 'ParagraphAccordionSection':
      return <Accordions data={data} />;
    case 'ParagraphSectionButton':
      return <ButtonSection data={data} />
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
};
