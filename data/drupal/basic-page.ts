import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { handleGraphQLError, query } from "@/lib/apollo";
import { getTestimonialByTag } from "@/data/drupal/testimonial";
import { getProfileTypes } from "@/data/drupal/profile";

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
    handleGraphQLError(error);
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

  // We need to resolve testimonials by tag.
  // This function recursively processes widgets, including nested ones in sections
  async function processWidget(widget: any): Promise<any> {
    //console.log('processWidget called with:', widget.__typename);
    if (widget.__typename === "ParagraphTestimonialSlider") {
      const tags =
        widget.byTags
          ?.map((tag: any) => {
            if (tag.__typename === "TermTag") {
              return tag.id;
            }
            return null;
          })
          .filter((tag: any) => typeof tag === "string") ?? [];

      if (tags.length === 0) {
        return widget;
      }

      return {
        ...widget,
        byTags: (await getTestimonialByTag(tags)) ?? [],
      };
    }

    // Handle section widgets by recursively processing their content
    if (widget.__typename === "ParagraphSection" && widget.content) {
      return {
        ...widget,
        content: await Promise.all(widget.content.map((nestedWidget: any) => processWidget(nestedWidget))),
      };
    }

    return widget;
  }

  return {
    ...data.nodePage,
    widgets: await Promise.all(data.nodePage.widgets.map((widget) => processWidget(widget))),
  };
}
