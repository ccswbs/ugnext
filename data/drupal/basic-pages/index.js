import { graphql } from "@/lib/drupal";
import { toTitleCase } from "@/lib/string-utils";
import getPathsQuery from "./get-paths.graphql";
import getPageIDQuery from "./get-page-id.graphql";
import getPageTitleQuery from "./get-page-title.graphql";
import getPageQuery from "./get-page-content.graphql";
import getTestimonialsByTagQuery from "./get-testimonials-by-tag.graphql";
//import getPageMenuQuery from "./get-page-menu.graphql";

export const getPaths = async () => {
  // Here we can decide which pages get pre-rendered.
  let paths = [];
  let page = 0;
  const pageSize = 100;
  let hasNextPage = true;
  const limit = 1500; // Add a limit to the number of pages we prebuild

  while (hasNextPage && paths.length < limit) {
    const results = (
      await graphql(getPathsQuery, {
        page: page,
        pageSize: pageSize,
      })
    )?.data?.content?.results;

    results?.length === pageSize ? page++ : (hasNextPage = false);
    paths = [...paths, ...results];
  }

  return paths.map((node) => ({
    params: {
      slug: node?.path?.split("/").filter(Boolean),
    },
  }));
};

export const getPageID = async (url) => {
  const { data } = await graphql(getPageIDQuery, {
    url: url,
  });

  return data?.route?.entity?.id;
};

export const getPageContent = async (id, status) => {
  const { data } = await graphql(getPageQuery, {
    id: id,
    status: status,
  });

  const content = data?.contentRevisions?.results[0];

  // For Testimonial Sliders that are getting testimonials by tag, we need to fetch the testimonials separately
  const sliders = content.widgets.filter(
    (widget) => widget.__typename === "ParagraphTestimonialSlider" && widget?.byTags
  );

  for (const slider of sliders) {
    const tags = slider.byTags.map((tag) => tag.path.replace("/taxonomy/term/", ""));

    const { data } = await graphql(getTestimonialsByTagQuery, {
      tags: tags,
      status: status,
    });

    slider.byTags = data.testimonialsByTag.results;
  }

  return content;
};

export const getBreadcrumbs = async (slug, status) => {
  // NEED TO IMPROVE THIS TO LOWER THE AMOUNT OF QUERYING
  const crumbs = [];
  const stack = [...slug];

  while (stack.length > 0) {
    const url = "/" + stack.join("/");
    const title = (
      await graphql(getPageTitleQuery, {
        url: url,
      })
    )?.data?.route?.entity?.title;

    crumbs.unshift({
      title: title ? title : toTitleCase(stack[stack.length - 1]),
      url: url,
    });

    stack.pop();
  }

  return crumbs;
};

export const getPageMenu = async (page) => {
  const name = page?.primaryNavigation?.menuName;

  if (!name || name === "no_menu") {
    return null;
  }

  // Fetch the menu data
  const response = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/system/menu/${name}/linkset`);
  const menuRaw = await response.json();

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

  console.log("Processed menu data:", menuData);

  return menuData;
};