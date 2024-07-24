import React from "react";
// Source: https://www.labnol.org/code/19797-regex-youtube-id

export function extractVideoID(url) {
	let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#]*).*/;
  let match = url.match(regExp);

  if (match) {
    return match[7].split("?")[0];
  } else {
    console.log("Could not extract video ID.");
  }
}

export function computeLayout(data) {
  const region = data.region;
  const mediaDescription = data?.mediaDescription;
  const mediaBgColor = data?.mediaBgColor;

  const mediaSize = data?.mediaSize;
  const imageURL = data?.imageURL;
  const videoURL = data?.videoURL;
  const mediaButtons = data?.mediaButtons;
  const mediaAlignment = data?.mediaAlignment;
  //console.log(imageURL,videoURL)
  
  let mediaCol = 'w-full';
  let textCol = 'w-full';
  let textColBg = '';
  let headingColor = '';
  let leftDivClasses = '';
  let rightDivClasses = '';
  let disableFlex = false;

  let headingClass = '';
  let textColPadding = '';
  let textColHeight = '';
  let wrapperCol = '';

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
            textColBg = '';            
        break;
    }

  if (region === "Primary") {
    if (imageURL) {
        if (mediaDescription || mediaButtons) {
            switch(mediaSize) {
                case "small":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/3"; 
                    textCol = "md:w-2/3"; 
                    textColPadding = textColBg ? "p-4" : "";
                    wrapperCol = "md:w-1/2 flex flex-row mt-4"; 
                    break;
                case "medium":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/2"; 
                    textCol = "md:w-1/2"; 
                    textColPadding = textColBg ? "p-4" : "";
                    wrapperCol = "md:w-1/2 flex flex-row mt-4"; 
                    break;
                case "large":
                    mediaCol = "w-full"; 
                    textCol = "w-full"; 
                    textColHeight = "h-full"; 
                    wrapperCol = "md:w-1/2 mb-4 border-0 card"; 
                    break;
                default:
                    mediaCol = "w-full"; 
                    textCol = "w-full"; 
                    textColHeight = "h-full"; 
                    wrapperCol = "sm:w-auto mb-3 border-0 card"; 
                    break;
            }
        } else {
            switch(mediaSize) {
                case "small":
                    mediaCol = "md:w-1/3"; 
                    break;
                case "medium":
                    mediaCol = "md:w-1/2"; 
                    break;
                case "large":
                    mediaCol = "w-full"; 
                    break;
                default:
                    mediaCol = "sm:w-auto mb-3"; 
                    break;
            }
        }
    } else  if(videoURL){
        switch(mediaSize) {
            case "small":
                wrapperCol = "md:w-1/3 border-0 card mb-4"; 
                break;
            case "medium":
                wrapperCol = "md:w-1/2 border-0 card mb-4"; 
                break;
            case "large":
                wrapperCol = "w-full border-0 card mb-4"; 
                break;
            default:
                wrapperCol = "sm:w-auto border-0 card mb-4"; 
                break;
        }
    }
  } else if (region === "Secondary") {
    wrapperCol = "w-full border-0 card mb-4"; 
  } else {
    wrapperCol = textColBg + ' flex flex-row mt-5'; 

    if (imageURL) {
        if (mediaDescription || mediaButtons) {
            switch(mediaSize) {
                case "small":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/4"; 
                    textCol = "md:w-3/4"; 
                    textColHeight = "h-full"; 
                    textColPadding = textColBg ? "p-4" : "";
                    break;
                case "medium":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/3"; 
                    textCol = "md:w-2/3"; 
                    textColHeight = "h-full"; 
                    textColPadding = textColBg ? "p-4" : "";
                    break;
                case "large":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/2"; 
                    textCol = "md:w-1/2"; 
                    textColHeight = "h-full"; 
                    textColPadding = textColBg ? "p-4" : "";
                    break;
                default:
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/2"; 
                    textCol = "md:w-1/2"; 
                    textColHeight = "h-full"; 
                    textColPadding = textColBg ? "p-4" : "";
                    break;
            }
        } else {
            mediaCol = "w-full"; 
        }
    } else if (videoURL){
        if (mediaDescription || mediaButtons) {
            switch(mediaSize) {
                case "small":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/3"; 
                    textCol = "md:w-2/3"; 
                    textColHeight = "h-full"; 
                    break;
                case "medium":
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/2"; 
                    textCol = "md:w-1/2"; 
                    textColHeight = "h-full"; 
                    break;
                case "large":
                    mediaCol = "md:w-full"; 
                    textCol = "md:w-full"; 
                    textColHeight = "h-full"; 
                    break;
                default:
                    headingClass = "mt-md-0";
                    mediaCol = "md:w-1/2"; 
                    textCol = "md:w-1/2"; 
                    textColHeight = "h-full"; 
                    break;
            }
        } else {
            mediaCol = "w-full"; 
        }
    }

    if (textColBg) {
        mediaCol =  mediaCol + ' ps-0';
    }
  }

    return {
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
    };
  }


