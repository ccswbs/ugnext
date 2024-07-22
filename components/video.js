import React from 'react';

export function Video ({ videoTitle, videoTranscript, videoHeight, videoWidth, videoType, videoID }) {
    
    
    let ratio = videoWidth / videoHeight;
    ratio = +ratio.toFixed(2);
    const aspectRatio = (ratio === 2.34 ? "21by9" : "16by9");


    const youtubeURL = "https://www.youtube.com/embed/";
    const vimeoURL = "https://player.vimeo.com/video/";
    let videoSrc = (videoType === `youtube` ? youtubeURL + videoID : vimeoURL + videoID);

    return (<>
        <div className={"embed-responsive embed-responsive-" + aspectRatio}>
            <iframe allowFullScreen src={videoSrc} title={videoTitle ? videoTitle : videoType + " video player"} />
        </div>
        {videoTranscript && <a className="btn btn-primary w-100" href={videoTranscript}>Download transcript<span className="visually-hidden"> for {videoTitle + " video"}</span></a>}
    </>)
}
