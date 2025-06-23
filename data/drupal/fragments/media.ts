import { gql } from "@/lib/graphql";

export const IMAGE_FRAGMENT = gql(/* gql */ `
  fragment Image on MediaImage {
    __typename
    image {
      height
      alt
      width
      url
    }
  }
`);

export const VIDEO_FRAGMENT = gql(/* gql */ `
  fragment Video on MediaVideo {
    __typename
    video {
      name
      url
      mime
    }
  }
`);

export const AUDIO_FRAGMENT = gql(/* gql */ `
  fragment Audio on MediaAudio {
    __typename
    name
    audio {
      name
      url
      mime
    }
  }
`);

export const REMOTE_VIDEO_FRAGMENT = gql(/* gql */ `
  fragment RemoteVideo on MediaRemoteVideo {
    __typename
    height
    width
    url
    name
    cc {
      url
      name
    }
    transcript {
      name
      url
    }
  }
`);
