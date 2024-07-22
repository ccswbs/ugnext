import { twJoin } from 'tailwind-merge';
import { extractVideoID } from '@/lib/ug-utils';
import Image from 'next/image';
import { Heading } from '@/components/heading';
import { Video } from '@/components/video';
import { HtmlParser } from '@/components/html-parser';

export const MediaText = ({ data }) => {
	const mediaTitle = data.heading;
	const mediaDescription = data.description.processed;
	const mediaBgColor = data.background;
	
	const mediaSize = data?.mediaImageSize;
	const imageURL = data?.media?.image?.url;
	const imageAlt = data?.media?.image?.alt;
	const imageWidth = data?.media?.image?.width;
	const imageHeight = data?.media?.image?.height;
	const mediaAlignment = data?.mediaAlignment;
    
    const videoTitle = data?.media?.name;
    const videoTranscript = data?.media?.transcript;
    const videoURL = data?.media?.url;
    const videoHeight = data?.media?.height;
    const videoWidth = data?.media?.width;
    const videoType = (videoURL?.includes("youtube") || videoURL?.includes("youtu.be") ? `youtube` : `vimeo`);
    const videoID = (videoType === `youtube` ? extractVideoID(videoURL) : videoURL?.substring(18));

	const mediaButtons = data.buttonSection;
    //const mediaRelationships = data.widgetData?.relationships.field_media_text_media?.relationships;

	//console.log(mediaTitle,mediaDescription,mediaBgColor,imageURL,imageAlt,mediaAlignment,mediaSize)
	//console.log(videoType)
	
	
	return (
		<div>
			{mediaTitle && 
				<Heading level={2} className="mb-7 mt-7 font-bold text-3xl text-red">
					{mediaTitle}
				</Heading>
			}
			{mediaDescription &&
					<HtmlParser html={mediaDescription} />
			}
			{imageURL &&
				<Image 
					className={twJoin(
						'w-1/2'
					)}
					src={imageURL}
					alt={imageAlt}
					width={imageWidth}
					height={imageHeight}
				/>
			}

			{videoURL &&
				<Video 
					videoTitle = {videoTitle}
					videoTranscript = {videoTranscript}
					videoHeight = {videoHeight}
					videoWidth = {videoWidth}
					videoType = {videoType}
					videoID = {videoID}			
				/>
			}
		</div>
	)
};
