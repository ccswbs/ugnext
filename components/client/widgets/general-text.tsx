import { HtmlParser } from "@/components/client/html-parser";
import type { GeneralTextFragment } from "@/lib/graphql/types";

export const GeneralTextWidget = ({ data }: { data: GeneralTextFragment }) => (
  <div id={`general-text-${data.uuid}`} className="contents [&>ul]:columns-1 [&>ul]:md:columns-3 [&>ul]:gap-[1.5rem] [&>ul>li]:break-inside-avoid">
    <HtmlParser key={data.id} html={data.body.processed} />
  </div>
);
