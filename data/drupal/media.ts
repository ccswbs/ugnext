import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { getClient } from "@/lib/apollo";

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

export async function getMediaPathById(id: string) {
  const showUnpublished = await showUnpublishedContent();
  const query = getClient().query;
  const mediaQuery = gql(/* gql */ `
    query MediaPath($id: ID!, $revision: ID = "current") {
      mediaFile(id: $id, revision: $revision) {
        file {
          url
        }
      }
      mediaImage(id: $id, revision: $revision) {
        image {
          url
        }
      }
      mediaRemoteVideo(id: $id, revision: $revision) {
        url
      }
    }
  `);

  const { data } = await query({
    query: mediaQuery,
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (data?.mediaFile) {
    return data.mediaFile.file.url;
  } else if (data?.mediaImage) {
    return data.mediaImage.image.url;
  } else if (data?.mediaVideo) {
    return data.mediaVideo.video.url;
  } else if (data?.mediaAudio) {
    return data.mediaAudio.audio.url;
  } else if (data?.mediaRemoteVideo) {
    return data.mediaRemoteVideo.url;
  } else {
    return null;
  }
}
