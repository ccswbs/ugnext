import { HtmlParser } from '@/components/html-parser';

export const GeneralText = ({ data }) => <HtmlParser key={data.id} html={data.body.processed} />;
