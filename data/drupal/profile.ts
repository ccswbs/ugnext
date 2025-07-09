import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { query } from "@/lib/apollo";
//import { getTestimonialByTag } from "@/data/drupal/testimonial";

export const PROFILE_FRAGMENT = gql(/* gql */ `
  fragment Profile on NodeProfile {
    status
    id
    title
    path
    primaryNavigation {
      ...Navigation
    }
    uniwebId
    body {
      processed
    }
    profileType {
      ...ProfileType
    }
    profileSections {
      ... on ParagraphProfilePart {
        id  
        profilePartText {
          processed
        }
        profilePartLabel
      }
    }
    profilePicture {
      ...Image
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);

export async function getProfileContent(id: string) {
  const showUnpublished = await showUnpublishedContent();

  const { data } = await query({
    query: gql(/* gql */ `
      query ProfileContent($id: ID!, $revision: ID = "current") {
        nodeProfile(id: $id, revision: $revision) {
          ...Profile
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (!data?.nodeProfile) {
    return null;
  }

  if (data.nodeProfile.status === false && !showUnpublished) {
    return null;
  }

  return {
    ...data.nodeProfile,
  };
}