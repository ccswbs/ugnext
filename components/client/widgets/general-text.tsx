import { HtmlParser } from "@/components/client/html-parser";
import type { GeneralTextFragment } from "@/lib/graphql/types";

export const GeneralTextWidget = ({ data }: { data: GeneralTextFragment }) => (
  <div id={`general-text-${data.uuid}`} className="contents first:*:mt-0! first:*:pt-0!">
    <HtmlParser key={data.id} html={data.body.processed} />
  </div>
);
