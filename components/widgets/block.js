import { HtmlParser } from "@/components/html-parser";
import { WidgetSelector } from "@/components/widgets/widget-selector";

const BasicBlock = ({ data }) => {
  return <HtmlParser key={data.id} html={data.body.processed} />;
};

const WidgetBlock = ({ data }) => {
  return <WidgetSelector data={data.content} />;
};

const YamlBlock = ({ data }) => {
  return (
    <>
      <div>YAML BLOCK: {JSON.stringify(data)}</div>
    </>
  );
};

export const BlockWidget = ({ data }) => {
  const map = {
    BlockContentBasic: BasicBlock,
    BlockContentWidgetBlock: WidgetBlock,
    BlockContentYamlBlock: YamlBlock,
  };

  const Widget = map[data.block.__typename];

  return <Widget data={data.block} />;
};
