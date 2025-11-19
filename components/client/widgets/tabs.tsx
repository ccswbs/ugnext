import { Tabs as TabsComponent, TabList, Tab, TabPanels, TabPanel } from "@uoguelph/react-components/tabs";
import { HtmlParser } from "@/components/client/html-parser";
import type { TabsFragment } from "@/lib/graphql/types";

export function TabsWidget({ data }: { data: TabsFragment }) {
  return (
    <TabsComponent id={`tabs-${data.uuid}`}>
      <TabList>
        {data?.tabs?.map((tab) => (
          <Tab key={tab.title}>{tab.title}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {data?.tabs?.map((tab) => (
          <TabPanel key={tab.title}>
            <HtmlParser html={tab.body.processed} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabsComponent>
  );
}
