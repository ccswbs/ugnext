import { graphql } from "@/lib/drupal";
import { toTitleCase } from "@/lib/string-utils";
import getPageIDQuery from "./get-page-id.graphql";
import getLegacyNewsItemQuery from "./get-legacy-news-content.graphql";
import getLegacyNewsListQuery from "./get-legacy-news-list.graphql";

export const getPageID = async (url) => {
  const { data } = await graphql(getPageIDQuery, {
    url: url,
  });

  return data?.route?.entity?.id;
};

export const getLegacyNews = async (id, status) => {
  const { data } = await graphql(getLegacyNewsItemQuery, {
    id: id,
    status: status,
  });

  return data;
};

export const getLegacyNewsList = async () => {
  const { data } = await graphql(getLegacyNewsListQuery, {});

  return data.legacyNews.results;
};

export const getPageMenu = async (page) => {
  const name = "ovc-main"; // OVC menu name

  // Fetch the menu data
  let menuRaw;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/system/menu/${name}/linkset`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.statusText}`);
    }
    menuRaw = await response.json();
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }

  // Helper function to parse the raw menu data
  const parseMenu = (linkset) => {
    const topic = {};
    const navigation = [];
    const hierarchyMap = {}; // Map to track hierarchy[0] to navigation index

    linkset.forEach((link) => {
      link.item.forEach((item) => {
        const hierarchy = item.hierarchy || [];
        const title = item.title || "Untitled";
        const url = item.href || "#";

        if (hierarchy.length === 1 && hierarchy[0] === "0") {
          // Assign the top-level item to the menu topic object
          topic.title = title;
          topic.url = url;
        } else if (hierarchy.length === 1 && hierarchy[0] !== "0") {
          // Add other menu items to navigation
          const index = navigation.length;
          navigation.push({ title, url, items: [] });
          hierarchyMap[hierarchy[0]] = index; // Map hierarchy[0] to navigation index
        } else if (hierarchy.length === 2) {
          // Add submenu items
          const parentKey = hierarchy[0]; // Parent key from hierarchy
          const parentIndex = hierarchyMap[parentKey]; // Get the correct index from the map
          if (parentIndex !== undefined && navigation[parentIndex]) {
            navigation[parentIndex].items.push({ title, url });
          }
        }
      });
    });

    // Add parent items with URLs to the beginning of their respective items array
    navigation.forEach((navItem) => {
      if (navItem.url !== "#" && navItem.items.length > 1) {
        navItem.items.unshift({ title: navItem.title, url: navItem.url });
      }
    });

    return { topic, navigation };
  };

  // Parse the menu data
  const menuData = parseMenu(menuRaw.linkset);

  return menuData;
};

