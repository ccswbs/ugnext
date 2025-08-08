import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { query } from "@/lib/apollo";
import { getTestimonialByTag } from "@/data/drupal/testimonial";

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
      ...Accordion
      ...Block
      ...GeneralText
      ...Links
      ...MediaText
      ...Tabs
      ...Statistics
      ...TestimonialSlider
      ...Story
      ...ImageOverlay
      ...Section
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);

export async function getPageContent(id: string) {
  const showUnpublished = await showUnpublishedContent();

  const { data } = await query({
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

  if (!data?.nodePage) {
    return null;
  }

  if (data.nodePage.status === false && !showUnpublished) {
    return null;
  }

  if (!data.nodePage.widgets) {
    return data.nodePage;
  }

  // We need to resolve testimonials by tag.
  return {
    ...data.nodePage,
    widgets: await Promise.all(
      data.nodePage.widgets.map(async (widget) => {
        if (widget.__typename === "ParagraphTestimonialSlider") {
          const tags =
            widget.byTags
              ?.map((tag) => {
                if (tag.__typename === "TermTag") {
                  return tag.id;
                }
                return null;
              })
              .filter((tag) => typeof tag === "string") ?? [];

          if(tags.length === 0) {
            return widget;
          }

          return {
            ...widget,
            byTags: (await getTestimonialByTag(tags)) ?? [],
          };
        }
        return widget;
      })
    ),
  };
}
