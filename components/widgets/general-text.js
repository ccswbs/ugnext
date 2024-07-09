import { HtmlParser } from '@/components/html-parser';

export const GeneralText = ({ data }) => <HtmlParser html={data.body.processed} />;