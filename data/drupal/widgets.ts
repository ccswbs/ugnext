import { gql } from "@/lib/graphql";

export const ACCORDION_FRAGMENT = gql(/* gql */ `
  fragment Accordion on ParagraphAccordionSection {
    __typename
    id
    headingLevel
    accordionSectionTitle: title
    items {
      ... on ParagraphAccordionBlock {
        headingLevel
        accordionTitle: title
        text {
          processed
        }
      }
    }
    sectionColumn {
      ...SectionColumn
    }
  }
`);

export const BLOCK_FRAGMENT = gql(/* gql */ `
  fragment Block on ParagraphBlockWidget {
    __typename
    sectionColumn {
      ...SectionColumn
    }
    block {
      __typename
      ...BasicBlock
      ...WidgetBlock
    }
    id
  }
`);

export const BUTTONS_FRAGMENT = gql(/* gql */ `
  fragment Buttons on ParagraphButtonWidget {
    __typename
    ctaAnalyticsGoal {
      ... on TermGoal {
        action
        name
      }
    }
    ctaHeading {
      processed
    }
    fontAwesomeIcon
    fontAwesomeIconColour {
      ... on TermColourVariable {
        name
      }
    }
    formattedTitle {
      processed
    }
    id
    link {
      title
      url
    }
    style {
      ... on TermButtonStyle {
        name
      }
    }
  }
`);

export const BUTTON_SECTION_FRAGMENT = gql(/* gql */ `
  fragment ButtonSection on ParagraphSectionButton {
    __typename
    id
    buttons {
      ...Buttons
    }
    buttonSectionColumn: sectionColumn {
      __typename
      ...SectionColumn
      ...SpecialRegions
    }
  }
`);

export const GENERAL_TEXT_FRAGMENT = gql(/* gql */ `
  fragment GeneralText on ParagraphGeneralText {
    __typename
    id
    sectionColumn {
      ...SectionColumn
    }
    body {
      processed
    }
  }
`);

export const IMAGE_OVERLAY_FRAGMENT = gql(/* gql */ `
  fragment ImageOverlay on ParagraphImageOverlay {
    __typename
    backgroundImage {
      ...Image
    }
    imageOverlayContent: content {
      ...GeneralText
      ...ButtonSection
      ...StoryQuote
      ...StoryModalVideo
    }
    imageOverlayStyle: style {
      ... on TermImageOverlayStyle {
        name
      }
    }
    contentAlignment {
      ... on TermAlignmentStyle {
        name
      }
    }
  }
`);

export const LINKS_FRAGMENT = gql(/* gql */ `
  fragment Links on ParagraphLinksWidget {
    __typename
    links {
      ... on ParagraphLinkItem {
        url {
          title
          url
        }
        image {
          ...Image
        }
        description
      }
    }
  }
`);

export const MEDIA_TEXT_FRAGMENT = gql(/* gql */ `
  fragment MediaText on ParagraphMediaText {
    __typename
    heading: title
    mediaImageSize
    buttonSection {
      ...ButtonSection
    }
    media {
      __typename
      ...Image
      ...RemoteVideo
    }
    mediaAlignment
    mediaImageSize
    sectionColumn {
      ...SectionColumn
    }
    headingLevel
    description {
      processed
    }
    background {
      ... on TermBgColor {
        name
      }
    }
  }
`);

export const MODAL_VIDEO_FRAGMENT = gql(/* gql */ `
  fragment ModalVideo on ParagraphModalVideoWidget {
    __typename
    video {
      ...RemoteVideo
    }
  }
`);

export const SECTION_FRAGMENT = gql(/* gql */ `
  fragment Section on ParagraphSection {
    __typename
    id
    heading: title
    headingLevel
    content {
      __typename
      ...Accordion
      ...Block
      ...GeneralText
      ...Links
      ...MediaText
      ...ButtonSection
      ...Tabs
      ...Statistics
      ...ImageOverlay
    }
  }
`);

export const SOCIAL_MEDIA_FRAGMENT = gql(/* gql */ `
  fragment SocialMedia on ParagraphSocialMediaWidget {
    __typename
    id
    socialMediaTitle
    headingLevel
    iconAltText
    socialMediaLinks {
      name
      url
      value
    }
  }
`);

export const STATISTICS_FRAGMENT = gql(/* gql */ `
  fragment Statistics on ParagraphStatisticWidget {
    __typename
    id
    content {
      ... on ParagraphStatisticItem {
        image {
          ...Image
        }
        fontAwesomeIcon
        represents {
          processed
        }
        value
      }
    }
    style {
      ... on TermStatisticStyle {
        name
      }
    }
  }
`);

export const STORY_FRAGMENT = gql(/* gql */ `
  fragment Story on ParagraphStoryWidget {
    __typename
    content {
      ...Statistics
      ... on ParagraphStoryImageCutoutBackground {
        __typename
        id
        backgroundImage {
          ...Image
        }
        foregroundImage {
          ...Image
        }
        title
        text {
          processed
        }
        storyContent: content {
          ...StoryModalVideo
          ...StoryQuote
        }
      }
    }
  }
`);

export const STORY_MODAL_VIDEO_FRAGMENT = gql(/* gql */ `
  fragment StoryModalVideo on ParagraphStoryModalVideo {
    __typename
    id
    title {
      processed
    }
    video {
      ...RemoteVideo
    }
  }
`);

export const STORY_QUOTE_FRAGMENT = gql(/* gql */ `
  fragment StoryQuote on ParagraphStoryQuote {
    __typename
    id
    quoteContent: content
    quoteSource: source
    quoteDescription: description
    image {
      ...Image
    }
  }
`);

export const TABS_FRAGMENT = gql(/* gql */ `
  fragment Tabs on ParagraphSectionTab {
    __typename
    id
    tabs {
      ... on ParagraphTabContent {
        body {
          processed
        }
        title
      }
    }
    sectionColumn {
      ...SectionColumn
    }
  }
`);

export const TESTIMONIAL_SLIDER_FRAGMENT = gql(/* gql */ `
  fragment TestimonialSlider on ParagraphTestimonialSlider {
    __typename
    title
    byTitle {
      ...Testimonial
    }
    byTags {
      ...Tag
    }
  }
`);
