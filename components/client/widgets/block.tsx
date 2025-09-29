"use client";

import { HtmlParser } from "@/components/client/html-parser";
import type { BasicBlockFragment, BlockFragment, WidgetBlockFragment } from "@/lib/graphql/types";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";

const BasicBlock = ({ data }: { data: BasicBlockFragment }) => {
  return <HtmlParser key={data.id} html={data.body?.processed ?? ""} />;
};

const WidgetBlock = ({ data }: { data: WidgetBlockFragment }) => {
  return (
    <>
      {data.content?.map((item, index) => (
        <WidgetSelector key={item.id} data={item} />
      ))}
    </>
  );
};

export const BlockWidget = ({ data }: { data: BlockFragment }) => {
  const map = {
    BlockContentBasic: BasicBlock,
    BlockContentWidgetBlock: WidgetBlock,
  };

  if (!data.block) {
    console.error(`Widget Error ${data.__typename}: Block is null or undefined`, data);
    return <></>;
  }

  switch (data.block.__typename) {
    case "BlockContentBasic":
      return <BasicBlock data={data.block} />;
    case "BlockContentWidgetBlock":
      return <WidgetBlock data={data.block} />;
    default:
      console.error(`Widget Error ${data.__typename}: Block type is not supported`, data);
      return <></>;
  }
};
