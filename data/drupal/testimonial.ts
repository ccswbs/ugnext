import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { query } from "@/lib/apollo";

export const TESTIMONIAL_TYPE_FRAGMENT = gql(/* gql */ `
  fragment TestimonialType on TermTestimonialType {
    name
  }
`);

export const TESTIMONIAL_FRAGMENT = gql(/* gql */ `
  fragment Testimonial on NodeTestimonial {
    __typename
    id
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

  const { data } = await query({
    query: gql(/* gql */ `
      query TestimonialsByTag($tags: [String]) {
        testimonialsByTag(filter: { tags: $tags }) {
          results {
            ...Testimonial
            ... on NodeTestimonial {
              status
            }
          }
        }
      }
    `),
    variables: {
      tags: tags ?? [],
    },
  });

  return (
    data.testimonialsByTag?.results.filter((testimonial: any) => {
      if (testimonial.__typename === "NodeTestimonial") {
        if (testimonial.status === false && !showUnpublished) {
          return false;
        }
      } else {
        return false;
      }

      return true;
    }) ?? []
  );
}
