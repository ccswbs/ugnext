import { graphql } from '@/lib/drupal';
import { toTitleCase } from '@/lib/string-utils';
import getPathsQuery from './get-paths.graphql';
import getPageIDQuery from './get-page-id.graphql';
import getPageTitleQuery from './get-page-title.graphql';
import getPageQuery from './get-page-content.graphql';
import getTestimonialsByTagQuery from './get-testimonials-by-tag.graphql';
import getPageMenuQuery from './get-page-menu.graphql';

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
      slug: node?.path?.split('/').filter(Boolean),
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
    (widget) => widget.__typename === 'ParagraphTestimonialSlider' && widget?.byTags,
  );

  for (const slider of sliders) {
    const tags = slider.byTags.map((tag) => tag.path.replace('/taxonomy/term/', ''));

    const { data } = await graphql(getTestimonialsByTagQuery, {
      tags: tags,
      status: status,
    });

    slider.byTags = data.testimonialsByTag.results;
  }

  return content;
};

export const getPageMenu = async (page) => {
  const name = page?.primaryNavigation?.menuName?.toUpperCase()?.replaceAll('-', '_');

  if (!name) {
    return null;
  }

  const { data } = await graphql(getPageMenuQuery, {
    menu: name,
  });

  return data?.menu?.items ?? null;
};

export const getBreadcrumbs = async (slug, status) => {
  // NEED TO IMPROVE THIS TO LOWER THE AMOUNT OF QUERYING
  const crumbs = [];
  const stack = [...slug];

  while (stack.length > 0) {
    const url = '/' + stack.join('/');
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
