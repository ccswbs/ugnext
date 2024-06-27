import { GeneralText } from '@/components/widgets/general-text';
import { Accordions } from '@/components/widgets/accordions';
import { Links } from '@/components/widgets/links';
import { Tabs } from '@/components/widgets/tabs';

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
		default:
			return <span>{data.__typename} is not yet implemented</span>;
	}
};
