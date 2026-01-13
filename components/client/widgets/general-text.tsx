import { HtmlParser } from "@/components/client/html-parser";
import type { GeneralTextFragment } from "@/lib/graphql/types";

export const GeneralTextWidget = ({ data }: { data: GeneralTextFragment }) => (
  <HtmlParser key={data.id} html={data.body.processed} />
);
