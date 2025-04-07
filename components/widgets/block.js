import { HtmlParser } from "@/components/html-parser";
import { WidgetBlockSelector } from "@/components/widgets/widget-block-selector";

const BasicBlock = ({ data }) => {
  return <>This is a Basic Block: <HtmlParser key={data.id} html={data.body.processed} /></>;
};

const WidgetBlock = ({ data }) => {
  console.log(data.content);
  return <>This is a widget block showing {data.title}<WidgetBlockSelector data={data.content} /></>;
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
