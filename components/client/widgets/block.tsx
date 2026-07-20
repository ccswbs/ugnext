"use client";

import { HtmlParser } from "@/components/client/html-parser";
import { BasicBlockFragment, BlockFragment, WidgetBlockFragment } from "@/lib/graphql/types";
import { GroupedWidgets } from "@/components/client/widgets/media-widget-group";

const BasicBlock = ({ data }: { data: BasicBlockFragment }) => {
  return <HtmlParser key={data.id} html={data.body?.processed ?? ""} />;
};

const WidgetBlock = ({ data }: { data: WidgetBlockFragment }) => {
  return <GroupedWidgets widgets={data.content} neverWrap={true} />;
};

export const BlockWidget = ({ data }: { data: BlockFragment }) => {
  if (!data.block) {
    return null;
  }

  switch (data.block.__typename) {
    case "BlockContentWidgetBlock":
      return <WidgetBlock data={data.block} />;
    case "BlockContentBasic":
      return <BasicBlock data={data.block} />;
    default:
      // @ts-ignore
      console.warn(`Invalid block type: ${data.block.__typename}`);
      return null;
  }
};
