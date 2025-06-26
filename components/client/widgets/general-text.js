import { HtmlParser } from "@/components/client/html-parser";

export const GeneralTextWidget = ({ data }) => <HtmlParser key={data.id} html={data.body.processed} />;
