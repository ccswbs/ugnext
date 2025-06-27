import { Tabs as TabsComponent, TabList, Tab, TabPanels, TabPanel } from "@uoguelph/react-components/tabs";
import { HtmlParser } from "@/components/client/html-parser";

export function TabsWidget({ data }) {
  return (
    <TabsComponent>
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
