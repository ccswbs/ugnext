import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { handleGraphQLError, query } from "@/lib/apollo";
import { TestimonialFragment } from "@/lib/graphql/types";

export const TESTIMONIAL_TYPE_FRAGMENT = gql(/* gql */ `
  fragment TestimonialType on TermTestimonialType {
    name
  }
`);

export const TESTIMONIAL_FRAGMENT = gql(/* gql */ `
  fragment Testimonial on NodeTestimonial {
    __typename
    id
    status
    body {
      processed
    }
    profile {
      url
      title
    }
    type {
      ...TestimonialType
    }
    title
    name
    description
    image {
      ...Image
    }
  }
`);

export async function getTestimonialByTag(tags: string[]) {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query TestimonialsByTag($tags: [String]) {
        testimonialsByTag(filter: { tags: $tags }) {
          results {
            ...Testimonial
          }
        }
      }
    `),
    variables: {
      tags: tags ?? [],
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data) {
    return [];
  }

  const testimonials = data.testimonialsByTag?.results.filter((testimonial: any) => {
    if (testimonial.__typename === "NodeTestimonial") {
      if (testimonial.status === false && !showUnpublished) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  });

  return (testimonials ?? []) as TestimonialFragment[];
}
