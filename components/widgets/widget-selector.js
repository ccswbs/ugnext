import { GeneralText } from '@/components/widgets/general-text';
import { Accordions } from '@/components/widgets/accordions';

export const WidgetSelector = ({ data }) => {
	switch (data.__typename) {
		case 'ParagraphGeneralText':
			return <GeneralText data={data} />;
		case 'ParagraphAccordionSection':
			return <Accordions data={data} />;
		default:
			return <span>{data.__typename} is not yet implemented</span>;
	}
};
