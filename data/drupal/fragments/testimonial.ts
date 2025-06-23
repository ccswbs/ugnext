import { gql } from "@/lib/graphql";

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
