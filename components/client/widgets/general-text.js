import { HtmlParser } from "@/components/client/html-parser";

export const GeneralTextWidget = ({ data }) => (
  <div id={`general-text-${data.uuid}`} className="contents">
    <HtmlParser key={data.id} html={data.body.processed} />
  </div>
);
