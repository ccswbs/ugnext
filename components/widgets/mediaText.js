import { MediaText as MediaTextComponent } from '@/components/media-text';
import { HtmlParser } from '@/components/html-parser';
import { twJoin } from 'tailwind-merge';

export const MediaText = ({ data }) => {
	console.log(data);
	return (
		<MediaTextComponent
			data={data}
		/>
	)
	
};
