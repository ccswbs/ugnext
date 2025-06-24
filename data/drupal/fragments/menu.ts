import { gql } from "@/lib/graphql";

export const MENU_CONTENT_FRAGMENT = gql(/* gql */ `
  fragment MenuItem on MenuItem {
    title
    url
  }
`);

export const MENU_FRAGMENT = gql(/* gql */ `
  fragment Menu on Menu {
    items {
      ...MenuItem
      children {
        ...MenuItem
        children {
          ...MenuItem
          children {
            ...MenuItem
          }
        }
      }
    }
  }
`);
