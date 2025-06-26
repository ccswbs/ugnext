import { gql } from "@/lib/graphql";
import { query } from "@/lib/apollo";

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
      }
    }
  }
`);

export async function getMenuByName(name: string) {
  if (name === "NO_MENU") {
    return null;
  }

  const { data } = await query({
    query: gql(/* gql */ `
      query MenuByName($name: MenuAvailable!) {
        menu(name: $name) {
          ...Menu
        }
      }
    `),
    variables: {
      // @ts-ignore
      name: name,
    },
  });

  return data?.menu;
}
