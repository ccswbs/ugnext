import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { query } from "@/lib/apollo";
import { getTestimonialByTag } from "@/data/drupal/testimonial";
import { getProfiles, getProfilesByType } from "@/data/drupal/profile";

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

  // We need to resolve testimonials by tag and profiles for profile blocks.
  // This function recursively processes widgets, including nested ones in sections
  async function processWidget(widget: any): Promise<any> {
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

      if(tags.length === 0) {
        return widget;
      }

      return {
        ...widget,
        byTags: (await getTestimonialByTag(tags)) ?? [],
      };
    }

    if (widget.__typename === "ParagraphProfileCard") {
      // ProfileCard should already have the profileInfo populated by the GraphQL query
      // No additional fetching needed since the profile data comes directly from the CMS
      return widget;
    }

    if (widget.__typename === "ParagraphProfileBlock") {
      // Fetch profiles based on the criteria specified in the widget
      let profiles = [];

      try {
        // If specific profile types are specified, try to fetch by type first
        if (widget.profileType && widget.profileType.length > 0) {
          // For multiple types, we'll fetch all and filter client-side for simplicity
          // In a more optimized version, you could make multiple calls and merge
          profiles = await getProfiles();
        } else {
          // No specific criteria, fetch all profiles
          profiles = await getProfiles();
        }

        return {
          ...widget,
          profiles: profiles ?? [],
        };
      } catch (error) {
        console.error('Error fetching profiles for ProfileBlock:', error);
        return {
          ...widget,
          profiles: [],
        };
      }
    }

    // Handle section widgets by recursively processing their content
    if (widget.__typename === "ParagraphSection" && widget.content) {
      return {
        ...widget,
        content: await Promise.all(
          widget.content.map((nestedWidget: any) => processWidget(nestedWidget))
        ),
      };
    }

    return widget;
  }

  return {
    ...data.nodePage,
    widgets: await Promise.all(
      data.nodePage.widgets.map((widget: any) => processWidget(widget))
    ),
  };
}
