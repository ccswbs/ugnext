import { gql } from "@/lib/graphql";

export const CUSTOM_FOOTER_FRAGMENT = gql(/* gql */ `
  fragment CustomFooter on NodeCustomFooter {
    __typename
    title
    footerLogo {
      ...Image
    }
    widgets {
      ...GeneralText
      ...Links
      ...MediaText
      ...Section
      ...Block
    }
  }
`);