import { twJoin } from 'tailwind-merge';
import { extractVideoID } from '@/lib/ug-utils';

export const MediaText = ({ data }) => {
	const mediaTitle = data.heading;
	const mediaDescription = data.description.processed;
	const mediaBgColor = data.background;
	
	const mediaSize = data?.mediaImageSize;
	const imageURL = data?.media?.image?.url;
	const imageAlt = data?.media?.image?.alt;	
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

	console.log(mediaTitle,mediaDescription,mediaBgColor,imageURL,imageAlt,mediaAlignment,mediaSize)
	console.log(videoTitle, videoTranscript,videoURL,videoHeight,videoWidth,videoType,videoID,mediaButtons)
	
	
	return (
		<div>test</div>
	)
};
