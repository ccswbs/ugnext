import { Tabs as TabsComponent } from '@/components/tabs';
import { HtmlParser } from '@/components/html-parser';

export const Tabs = ({ data }) => (
	<TabsComponent
		tabs={data?.tabs?.map((tab) => ({
			title: tab.title,
			content: <HtmlParser html={tab.body.processed} />,
		}))}
	></TabsComponent>
);
