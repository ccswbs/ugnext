import { HtmlParser } from "@/components/html-parser";
import { WidgetBlockSelector } from "@/components/widgets/widget-block-selector";

const BasicBlock = ({ data }) => {
  return <HtmlParser key={data.id} html={data.body.processed} />;
};

const WidgetBlock = ({ data }) => {
  return <WidgetBlockSelector data={data.content} />;
};

export const BlockWidget = ({ data }) => {
  const map = {
    BlockContentBasic: BasicBlock,
    BlockContentWidgetBlock: WidgetBlock,
  };

  const Widget = map?.[data.block.__typename];

  if (!Widget) {
    return <>Invalid block type: {data.block.__typename}</>;
  }

  return <Widget data={data.block} />;
};
