import { HtmlParser } from "@/components/client/html-parser";
import type { GeneralTextFragment } from "@/lib/graphql/types";

export const GeneralTextWidget = ({ data }: { data: GeneralTextFragment }) => (
  <div id={`general-text-${data.uuid}`} className="contents">
    <HtmlParser key={data.id} html={data.body.processed} />
  </div>
);
