import { twJoin } from 'tailwind-merge';
import { extractVideoID, computeLayoutMediaText, buttonStyle } from '@/lib/ug-utils';
import Image from 'next/image';
import { Heading } from '@/components/heading';
import { Video } from '@/components/video';
import { HtmlParser } from '@/components/html-parser';
import { ButtonSection } from '@/components/widgets/button-section';
import ConditionalWrap from 'conditional-wrap';

export const MediaText = ({ data }) => {
	const region = data.sectionColumn.name;
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
	const videoType = videoURL?.includes('youtube') || videoURL?.includes('youtu.be') ? `youtube` : `vimeo`;
	const videoID = videoType === `youtube` ? extractVideoID(videoURL) : videoURL?.substring(18);

	const mediaButtons = data.buttonSection;
	let textOrButtons = mediaDescription || mediaButtons ? true : false;
	//const mediaRelationships = data.widgetData?.relationships.field_media_text_media?.relationships;

	const computeLayoutData = {
		region: region,
		mediaDescription: mediaDescription,
		mediaBgColor: mediaBgColor,
		mediaSize: mediaSize,
		imageURL: imageURL,
		videoURL: videoURL,
		mediaButtons: mediaButtons,
		mediaAlignment: mediaAlignment,
	};
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
		headingColor,
	} = computeLayoutMediaText(computeLayoutData);

	const videoData = {
		videoTitle: videoTitle,
		videoTranscript: videoTranscript,
		videoHeight: videoHeight,
		videoWidth: videoWidth,
		videoType: videoType,
		videoID: videoID,
	};
	//console.log(mediaTitle,textColPadding,wrapperCol)
	return (
		<ConditionalWrap condition={wrapperCol} wrap={(children) => <div className={wrapperCol}>{children}</div>}>
			<div className={twJoin('mx-auto', 'mt-4', 'md:flex', textColBg, headingColor, headingClass)}>
				<div className={twJoin('text-center w-full', mediaCol, leftDivClasses)} data-title="media">
					{videoURL && <Video className={twJoin('w-full')} videoData={videoData} />}

					{imageURL && (
						<Image className={twJoin('w-full')} src={imageURL} alt={imageAlt} width={imageWidth} height={imageHeight} />
					)}
				</div>

				{textOrButtons && (
					<div className={twJoin(textCol, rightDivClasses, 'w-full p-5')}>
						{mediaTitle && (
							<Heading level={3} className={twJoin('text-3xl font-bold', headingColor, headingClass)}>
								{mediaTitle}
							</Heading>
						)}
						{mediaDescription && <HtmlParser html={mediaDescription} />}
						{mediaButtons && <ButtonSection data={mediaButtons} />}
					</div>
				)}
			</div>
		</ConditionalWrap>
	);
};
