import { gql } from "@/lib/graphql";

export const SPOTLIGHT_FRAGMENT = gql(/* gql */ `
  fragment Spotlight on NodeSpotlight {
    status
    id
    rank
    title
    caption
    captionAlignment
    thumbnailImageCrop
    url {
      url
      title
    }
    image {
      ...Image
    }
    changed {
      time
    }
  }
`);
