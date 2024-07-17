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


