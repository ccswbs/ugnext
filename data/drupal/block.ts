import { gql } from "@/lib/graphql";

export const BASIC_BLOCK_FRAGMENT = gql(/* gql */ `
  fragment BasicBlock on BlockContentBasic {
    __typename
    id
    title
    body {
      processed
    }
  }
`);

export const WIDGET_BLOCK_FRAGMENT = gql(/* gql */ `
  fragment WidgetBlock on BlockContentWidgetBlock {
    __typename
    id
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
