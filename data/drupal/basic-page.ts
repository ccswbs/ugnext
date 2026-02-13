import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { query } from "@/lib/apollo";
import { getFullFeaturedNews, getFullTestimonialSlider, SectionWidgets, Widgets } from "@/data/drupal/widgets";

export const BASIC_PAGE_MINIMAL_FRAGMENT = gql(/* gql */ `
  fragment BasicPageMinimal on NodePage {
    status
    id
    title
    path
  }
`);

export const BASIC_PAGE_FRAGMENT = gql(/* gql */ `
  fragment BasicPage on NodePage {
    status
    id
    title
    path
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
      __typename
      ...Accordion
      ...Block
      ...GeneralText
      ...Links
      ...MediaText
      ...NewsSearch
      ...Tabs
      ...Statistics
      ...TestimonialSlider
      ...Story
      ...ImageOverlay
      ...Section
      ...ProfileBlock
      ...ProfileCard
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);

async function processSectionWidget(widget: SectionWidgets) {
  switch (widget.__typename) {
    case "ParagraphFeaturedNews":
      return await getFullFeaturedNews(widget);
    default:
      return widget;
  }
}

async function processWidget(widget: Widgets) {
  switch (widget.__typename) {
    case "ParagraphTestimonialSlider":
      return await getFullTestimonialSlider(widget);
    case "ParagraphSection":
      return {
        ...widget,
        content: await Promise.all(widget.content.map((nestedWidget) => processSectionWidget(nestedWidget))),
      };
    default:
      return widget;
  }
}

export async function getPageContent(id: string) {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query BasicPageContent($id: ID!, $revision: ID = "current") {
        nodePage(id: $id, revision: $revision) {
          ...BasicPage
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    console.error(`GraphQL Error: failed to retrieve content for basic page ${id}:\n\t${error}\n`);
    return null;
  }

  if (!data?.nodePage) {
    return null;
  }

  if (data.nodePage.status === false && !showUnpublished) {
    return null;
  }

  if (!data.nodePage.widgets) {
    return data.nodePage;
  }

  console.log(data);
  // We need to resolve testimonials by tag.
  return {
    ...data.nodePage,
    widgets: await Promise.all(data.nodePage.widgets.map(async (widget) => await processWidget(widget))),
  };
}
