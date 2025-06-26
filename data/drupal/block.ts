import { gql } from "@/lib/graphql";

export const BASIC_BLOCK_FRAGMENT = gql(/* gql */ `
  fragment BasicBlock on BlockContentBasic {
    __typename
    title
    body {
      processed
    }
  }
`);

export const WIDGET_BLOCK_FRAGMENT = gql(/* gql */ `
  fragment WidgetBlock on BlockContentWidgetBlock {
    __typename
    title
    content {
      ...Accordion
      ...ButtonSection
      ...GeneralText
      ...MediaText
      ...SocialMedia
      ...Tabs
    }
  }
`);
