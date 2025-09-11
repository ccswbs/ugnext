import { gql } from "@/lib/graphql";
import { handleGraphQLError, query } from "@/lib/apollo";
import { parse, type LinksetInterface } from "@drupal/linkset";
import type { MenuFragment } from "@/lib/graphql/types";

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

  const { data, error } = await query({
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

  if (!data) {
    handleGraphQLError(error);
  }

  return data.menu;
}

export async function getMenuByNameLinkset(menuName: string) {
  const name = menuName.toLowerCase().replaceAll("_", "-");

  if (!name || name === "no-menu") {
    return null;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/system/menu/${name}/linkset`);

  if (!response.ok) {
    console.error(`Failed to fetch menu ${name}: ${response.statusText}`);
    return null;
  }

  const data = await response.text();
  let linkset: LinksetInterface;

  try {
    linkset = parse(data);
  } catch (error) {
    console.error(`Error parsing linkset for menu ${name}:`, error);
    return null;
  }

  const menu: MenuFragment = { __typename: "Menu", items: [] };
  const links = linkset.elements.filter((link) => {
    if ("hierarchy" in link.attributes && Array.isArray(link.attributes.hierarchy)) {
      return link.attributes.hierarchy.length < 3;
    }

    return false;
  });

  for (const link of links) {
    const href = link.href;
    const title = link.attributes.title ?? "Untitled";
    const hierarchy = (link.attributes.hierarchy ?? []) as string[];

    if (hierarchy.length === 1) {
      menu.items.push({
        __typename: "MenuItem",
        title,
        url: href,
        children: [],
      });
    } else if (hierarchy.length === 2) {
      const index = Number.parseInt(hierarchy[0]);
      menu.items[index]?.children?.push({
        __typename: "MenuItem",
        title,
        url: href,
      });
    }
  }

  return menu;
}
