import { twJoin } from 'tailwind-merge';
import { extractVideoID } from '@/lib/ug-utils';
import Image from 'next/image';
import { Heading } from '@/components/heading';
import { Video } from '@/components/video';
import { HtmlParser } from '@/components/html-parser';

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

	let mediaCol = '';
    let textCol = '';
	let textColBg = 'bg-black';
    let headingColor = 'text-white';
	let leftDivClasses = '';
	let rightDivClasses = '';
	let disableFlex = false;

	if (mediaAlignment === "left") {
        leftDivClasses += "order-1"; // Align left content to the start
        rightDivClasses += "order-2"; // Align right content to the end
    } else if (mediaAlignment === "right") {
        leftDivClasses += "order-2"; // Align left content to the end
        rightDivClasses += "order-1"; // Align right content to the start
    }
	//console.log(mediaTitle,mediaDescription,mediaBgColor,imageURL,imageAlt,mediaAlignment,mediaSize)
	//console.log(mediaBgColor)
	switch(mediaBgColor) {
        case "Light Blue":
            textColBg = 'bg-uog-blue-muted';
            headingColor = 'text-black';            
        break;
        case "Dark Gray":
            textColBg = 'bg-grey-950';
            headingColor = 'text-white';
        break;
        default:
            textColBg = 'bg-grey-950';            
        break;
    }

	if (region === "Primary") {
        // For images
        if (imageURL) {
            if (mediaDescription || mediaButtons) {
                switch(mediaSize) {
                    case "small":
                        mediaCol = "md:w-1/4";
                        textCol = "md:w-3/4";
                    break;
                    case "medium":
                        mediaCol = "md:w-1/2";
                        textCol = "md:w-1/2";
                    break;
                    case "large":
                        mediaCol = "md:w-3/4";
                        textCol = "md:w-1/4";
                    break;
                    default:
                        mediaCol = "md:w-1/4";
                        textCol = "md:w-3/4";
                    break;
                }
            } else {
                switch(mediaSize) {
					case "small":
                        mediaCol = "md:w-1/4";
                        textCol = "md:w-3/4";
                    break;
                    case "medium":
                        mediaCol = "md:w-1/2";
                        textCol = "md:w-1/2";
                    break;
                    case "large":
                        mediaCol = "md:w-full";
                        textCol = "md:w-full";
                    break;
                    default:
                        mediaCol = "md:w-1/4";
                        textCol = "md:w-3/4";
                    break;
                }
            }
        // For videos in Primary section, text and/or buttons will always appear underneath
        } else {
            switch(mediaSize) {
                case "small":
                        mediaCol = "md:w-1/4";
                        textCol = "md:w-3/4";
                    break;
                    case "medium":
                        mediaCol = "md:w-1/2";
                        textCol = "md:w-1/2";
                    break;
                    case "large":
                        mediaCol = "md:w-full";
                        textCol = "md:w-full";
						disableFlex = true;
                    break;
                    default:
                        mediaCol = "md:w-1/4";
                        textCol = "md:w-3/4";
                    break;
            }
        }
    // Everything in the Secondary column is stacked
    }

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
            disableFlex ? '' : 'md:flex',
            textColBg,
            headingColor
        	)}>

			<div 
				className={twJoin("",mediaCol, leftDivClasses)}	
			>
				{videoURL &&
					
					<Video
						className={twJoin(
							'w-full'
						)}
						videoData={videoData}		
					/>
				}

				{imageURL &&
					<Image 
						className={twJoin(
							'w-full'
						)}
						src={imageURL}
						alt={imageAlt}
						width={imageWidth}
						height={imageHeight}
					/>
					
				}
			</div>

			{textOrButtons && 
				<div 
					className={twJoin(
						textCol, rightDivClasses, 'p-5'
					)}
				>
					{mediaTitle && 
						<Heading 
						level={2}
						className={twJoin("font-bold text-3xl",headingColor)}							
						>
							{mediaTitle}
						</Heading>
					}
					{mediaDescription &&
							<HtmlParser html={mediaDescription} />
					}
				</div>
			}				

		
		</div>
		
	)
};
