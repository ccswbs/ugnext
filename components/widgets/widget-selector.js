import { GeneralText } from '@/components/widgets/general-text';
import { Accordions } from '@/components/widgets/accordions';
import { Links } from '@/components/widgets/links';
import { Tabs } from '@/components/widgets/tabs';
import { Section } from '@/components/widgets/section';
import { Statistics } from '@/components/widgets/statistics';

export const WidgetSelector = ({ data }) => {
	switch (data.__typename) {
		case 'ParagraphGeneralText':
			return <GeneralText data={data} />;
		case 'ParagraphAccordionSection':
			return <Accordions data={data} />;
		case 'ParagraphLinksWidget':
			return <Links data={data} />;
		case 'ParagraphSectionTab':
			return <Tabs data={data} />;
		case 'ParagraphStatisticWidget':
			return <Statistics data={data} />
		case 'ParagraphSection':
			return <Section data={data} />;
		default:
			return <div>{data.__typename} is not yet implemented</div>;
	}
};
