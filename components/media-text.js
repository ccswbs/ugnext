import { twJoin } from 'tailwind-merge';
import { extractVideoID, computeLayoutMediaText, buttonStyle } from '@/lib/ug-utils';
import Image from 'next/image';
import { Heading } from '@/components/heading';
import { Video } from '@/components/video';
import { HtmlParser } from '@/components/html-parser';
import { Button } from '@/components/button';

export const MediaText = ({ data }) => {
	const region = data.sectionColumn.name;
	//const region = 'Primary';
console.log(region)
	const mediaTitle = data?.heading;
	const mediaDescription = data?.description?.processed;
	const mediaBgColor = data?.background?.name;
	
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
	let textOrButtons = mediaDescription || mediaButtons ? true : false;
    //const mediaRelationships = data.widgetData?.relationships.field_media_text_media?.relationships;

const computeLayoutData = {
	region : region,
	mediaDescription : mediaDescription,
	mediaBgColor : mediaBgColor,
	mediaSize : mediaSize,
	imageURL : imageURL,
	videoURL : videoURL,
	mediaButtons : mediaButtons,
	mediaAlignment : mediaAlignment
}
const {
      textColBg,
      headingClass,
      mediaCol,
      textCol,
      textColPadding,
      textColHeight,
      wrapperCol,
      leftDivClasses,
      rightDivClasses,
      disableFlex,
      headingColor
} = computeLayoutMediaText(computeLayoutData);

	const videoData = {
					videoTitle : videoTitle,
					videoTranscript : videoTranscript,
					videoHeight : videoHeight,
					videoWidth : videoWidth,
					videoType : videoType,
					videoID : videoID,
					}
	
	return (
		
		<div className={twJoin(
            'mx-auto',
            'mt-4',
            'md:flex',
            textColBg,
            headingColor,
			headingClass
        	)}
			data-title="media"
			>

			<div className={twJoin("",mediaCol, leftDivClasses)}>
				{videoURL &&					
					<Video
						className={twJoin('w-full')}
						videoData={videoData}		
					/>
				}

				{imageURL &&
					<Image 
						className={twJoin('w-full')}
						src={imageURL}
						alt={imageAlt}
						width={imageWidth}
						height={imageHeight}
					/>
					
				}
			</div>

			{textOrButtons && 
				<div className={twJoin(textCol, rightDivClasses, 'p-5')} >
					{mediaTitle && 
						<Heading 
							level={2}
							className={twJoin("font-bold text-3xl",headingColor,headingClass)}							
						>
							{mediaTitle}
						</Heading>
					}
					{mediaDescription &&
						<HtmlParser html={mediaDescription} />
					}
					{mediaButtons && mediaButtons.buttons.map((buttonData, index) => (						
						<Button 
							key={index} // Assuming index can serve as a unique key, ideally use a unique identifier from buttonData if available
							href={buttonData?.link?.url} // Replace with actual href from buttonData if available
							children={buttonData?.link?.title} // Assuming buttonData has a label field, adjust as needed
							//color={buttonData?.fontAwesomeIconColour?.name=='Default Colours'?'red':'white'} // Example color, adjust as needed
							className= {'w-1/3 py-4 text-xl'} // Example className, adjust as needed
							color={buttonStyle(buttonData?.style?.name)}
						/>
					))}
				</div>
			}				

		
		</div>
		
	)
};
