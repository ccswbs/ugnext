import React from 'react';
import { twJoin } from 'tailwind-merge';

export function Video ({videoData, className}) {
    //console.log(videoData);
    const { videoTitle, videoTranscript, videoHeight, videoWidth, videoType, videoID } = videoData;
    let ratio = videoWidth / videoHeight;
    ratio = +ratio.toFixed(2);
    
    const aspectRatio = (ratio === 2.34 ? "21by9" : "16by9");
    let embedResponsive = "embed-responsive embed-responsive-" + aspectRatio;

    const youtubeURL = "https://www.youtube.com/embed/";
    const vimeoURL = "https://player.vimeo.com/video/";
    let videoSrc = (videoType === `youtube` ? youtubeURL + videoID : vimeoURL + videoID);

    return (<>
        <div 
        className={twJoin(
          embedResponsive, className, 'relative'
        )}
        style={{ paddingTop:'56.25%' }} 
        >
            <iframe className='w-full h-full absolute top-0 left-0' allowFullScreen src={videoSrc} title={videoTitle ? videoTitle : videoType + " video player"} />
        </div>
        {videoTranscript && <a className="flex justify-center items-center text-white bg-red-700 w-full py-2 btn btn-primary" href={videoTranscript}>Download transcript<span className="visually-hidden"> for {videoTitle + " video"}</span></a>}
    </>)
}
