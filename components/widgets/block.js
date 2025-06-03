import { HtmlParser } from "@/components/html-parser";
import { WidgetBlockSelector } from "@/components/widgets/widget-block-selector";

const BasicBlock = ({ data }) => {
  return <HtmlParser key={data.id} html={data.body.processed} />;
};

const WidgetBlock = ({ data }) => {
  return <WidgetBlockSelector data={data.content} />;
};

const YamlBlock = ({ data }) => {
  return (
    <>
      <div>YAML BLOCK: {JSON.stringify(data)}</div>
    </>
  );
};

export const Block = ({ data }) => {
  const map = {
    BlockContentBasic: BasicBlock,
    BlockContentWidgetBlock: WidgetBlock,
    BlockContentYamlBlock: YamlBlock,
  };

  const Widget = map[data.block.__typename];

  return <Widget data={data.block} />;
};
