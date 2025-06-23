import { gql } from "@/lib/graphql";

export const SPOTLIGHT_FRAGMENT = gql(/* gql */ `
  fragment Spotlight on NodeSpotlight {
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
  }
`);
