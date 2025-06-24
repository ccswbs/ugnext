import { gql } from "@/lib/graphql";

export const BASIC_PAGE_FRAGMENT = gql(/* gql */ `
  fragment BasicPage on NodePage {
    status
    id
    title
    primaryNavigation {
      ...Navigation
    }
    image {
      ...Image
    }
    heroWidgets {
      ...ModalVideo
    }
    widgets {
      ...Accordion
      ...Block
      ...GeneralText
      ...Links
      ...MediaText
      ...Tabs
      ...Statistics
      ...TestimonialSlider
      ...Story
      ...ImageOverlay
      ...Section
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);
