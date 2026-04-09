import { gql } from "@/lib/graphql";
import {
  AccordionFragment,
  BlockFragment,
  ButtonSectionFragment,
  ButtonsFragment,
  CallToActionFragment,
  FeaturedNewsFragment,
  GeneralTextFragment,
  ImageOverlayFragment,
  LinksFragment,
  MediaTextFragment,
  ModalVideoFragment,
  NewsSearchFragment,
  NewsWithoutContentFragment,
  ProfileBlockFragment,
  ProfileCardFragment,
  RelatedContentFragment,
  SectionFragment,
  SocialMediaFragment,
  StatisticsFragment,
  StoryFragment,
  StoryModalVideoFragment,
  StoryQuoteFragment,
  TabsFragment,
  TestimonialFragment,
  TestimonialSliderFragment,
} from "@/lib/graphql/types";
import { getTestimonialByTag } from "@/data/drupal/testimonial";
import { getFilteredNews } from "@/data/drupal/news";

export const ACCORDION_FRAGMENT = gql(/* gql */ `
  fragment Accordion on ParagraphAccordionSection {
    __typename
    uuid
    id
    headingLevel
    accordionSectionTitle: title
    accordionDescription {
      processed
    }
    items {
      ... on ParagraphAccordionBlock {
        uuid
        headingLevel
        accordionTitle: title
        text {
          processed
        }
      }
    }
    sectionColumn {
      ...SectionColumn
    }
  }
`);

export const BLOCK_FRAGMENT = gql(/* gql */ `
  fragment Block on ParagraphBlockWidget {
    __typename
    uuid
    sectionColumn {
      ...SectionColumn
    }
    block {
      __typename
      ...BasicBlock
      ...WidgetBlock
    }
    id
  }
`);

export const BUTTONS_FRAGMENT = gql(/* gql */ `
  fragment Buttons on ParagraphButtonWidget {
    __typename
    uuid
    ctaAnalyticsGoal {
      ... on TermGoal {
        action
        name
      }
    }
    ctaHeading {
      processed
    }
    fontAwesomeIcon
    fontAwesomeIconColour {
      ... on TermColourVariable {
        name
      }
    }
    formattedTitle {
      processed
    }
    id
    link {
      title
      url
    }
    style {
      ... on TermButtonStyle {
        name
      }
    }
  }
`);

export const BUTTON_SECTION_FRAGMENT = gql(/* gql */ `
  fragment ButtonSection on ParagraphSectionButton {
    __typename
    uuid
    id
    buttons {
      ...Buttons
    }
    buttonSectionColumn: sectionColumn {
      __typename
      ...SectionColumn
      ...SpecialRegions
    }
  }
`);

export const CALL_TO_ACTION_FRAGMENT = gql(/* gql */ `
  fragment CallToAction on ParagraphCallToAction {
    __typename
    uuid
    id
    sectionColumn {
      ...SectionColumn
    }
    primaryLink {
      title
      url
    }
    secondaryLink {
      title
      url
    }
    buttons {
      ...Buttons
    }
    goal {
      ...Goal
    }
  }
`);

export const FEATURED_NEWS_FRAGMENT = gql(/* gql */ `
  fragment FeaturedNews on ParagraphFeaturedNews {
    __typename
    uuid
    id
    count
    title: newsSearchTitle
    hideImages
    headingLevel
    sectionColumn {
      ...SectionColumn
    }
    articles {
      ...NewsWithoutContent
    }
    categories {
      ...NewsCategory
    }
    units {
      ...Unit
    }
    tags {
      ...Tag
    }
  }
`);

export const GENERAL_TEXT_FRAGMENT = gql(/* gql */ `
  fragment GeneralText on ParagraphGeneralText {
    __typename
    uuid
    id
    sectionColumn {
      ...SectionColumn
    }
    body {
      processed
    }
  }
`);

export const IMAGE_OVERLAY_FRAGMENT = gql(/* gql */ `
  fragment ImageOverlay on ParagraphImageOverlay {
    __typename
    uuid
    id
    backgroundImage {
      ...Image
    }
    imageOverlayContent: content {
      ...GeneralText
      ...ButtonSection
      ...StoryQuote
      ...StoryModalVideo
    }
    imageOverlayStyle: style {
      ... on TermImageOverlayStyle {
        name
      }
    }
    contentAlignment {
      ... on TermAlignmentStyle {
        name
      }
    }
  }
`);

export const LINKS_FRAGMENT = gql(/* gql */ `
  fragment Links on ParagraphLinksWidget {
    __typename
    uuid
    id
    title
    linksDescription: description
    links {
      ... on ParagraphLinkItem {
        url {
          title
          url
        }
        image {
          ...Image
        }
        description
      }
    }
  }
`);

export const MEDIA_TEXT_FRAGMENT = gql(/* gql */ `
  fragment MediaText on ParagraphMediaText {
    __typename
    uuid
    id
    heading: title
    mediaImageSize
    buttonSection {
      ...ButtonSection
    }
    media {
      __typename
      ...Image
      ...RemoteVideo
    }
    mediaAlignment
    mediaImageSize
    mediaIsDecorative
    sectionColumn {
      ...SectionColumn
    }
    headingLevel
    description {
      processed
    }
    background {
      ... on TermBgColor {
        name
      }
    }
  }
`);

export const MODAL_VIDEO_FRAGMENT = gql(/* gql */ `
  fragment ModalVideo on ParagraphModalVideoWidget {
    __typename
    uuid
    id
    video {
      ...RemoteVideo
    }
  }
`);

export const NEWS_SEARCH_FRAGMENT = gql(/* gql */ `
  fragment NewsSearch on ParagraphNewsSearch {
    __typename
    uuid
    id
    units {
      ...Unit
    }
  }
`);

export const PROFILE_BLOCK_FRAGMENT = gql(/* gql */ `
  fragment ProfileBlock on ParagraphProfileBlock {
    __typename
    id
    sectionColumn {
      ...SectionColumn
    }
    headingLevel
    profileBlockTitle
    profileType {
      ... on TermProfileType {
        name
      }
    }
    researchArea {
      ... on TermResearch {
        name
      }
    }
    unit {
      ... on TermUnit {
        id
        name
        acronym
      }
    }
    enableNameSearch
    enableResearchFilter
    enableTypeFilter
    enableUnitFilter
  }
`);

export const PROFILE_CARD_FRAGMENT = gql(/* gql */ `
  fragment ProfileCard on ParagraphProfileCard {
    __typename
    id
    profileInfo {
      ... on NodeProfile {
        id
        title
        centralLoginId
        customLink {
          title
          url
        }
        directoryEmail
        directoryOffice
        directoryPhone
        profileJobTitle
        profileFirstName
        path
        profilePicture {
          ...Image
        }
      }
    }
    sectionColumn {
      ...SectionColumn
    }
    showProfileLink
  }
`);

export const SECTION_FRAGMENT = gql(/* gql */ `
  fragment Section on ParagraphSection {
    __typename
    uuid
    id
    heading: title
    headingLevel
    classes
    content {
      __typename
      ...Accordion
      ...Block
      ...FeaturedNews
      ...GeneralText
      ...Links
      ...MediaText
      ...ButtonSection
      ...Tabs
      ...Statistics
      ...ImageOverlay
      ...ProfileBlock
      ...ProfileCard
    }
  }
`);

export const SOCIAL_MEDIA_FRAGMENT = gql(/* gql */ `
  fragment SocialMedia on ParagraphSocialMediaWidget {
    __typename
    uuid
    id
    socialMediaTitle
    headingLevel
    iconAltText
    socialMediaLinks {
      name
      url
      value
    }
  }
`);

export const STATISTICS_FRAGMENT = gql(/* gql */ `
  fragment Statistics on ParagraphStatisticWidget {
    __typename
    uuid
    id
    content {
      ... on ParagraphStatisticItem {
        image {
          ...Image
        }
        fontAwesomeIcon
        represents {
          processed
        }
        value
      }
    }
    style {
      ... on TermStatisticStyle {
        name
      }
    }
  }
`);

export const STORY_FRAGMENT = gql(/* gql */ `
  fragment Story on ParagraphStoryWidget {
    __typename
    uuid
    id
    content {
      ...Statistics
      ...StoryImageCutoutBackground
    }
  }
`);

export const STORY_IMAGE_CUTOUT_BACKGROUND_FRAGMENT = gql(/* gql */ `
  fragment StoryImageCutoutBackground on ParagraphStoryImageCutoutBackground {
    __typename
    id
    backgroundImage {
      ...Image
    }
    foregroundImage {
      ...Image
    }
    title
    text {
      processed
    }
    storyContent: content {
      ...StoryModalVideo
      ...StoryQuote
    }
  }
`);

export const STORY_MODAL_VIDEO_FRAGMENT = gql(/* gql */ `
  fragment StoryModalVideo on ParagraphStoryModalVideo {
    __typename
    uuid
    id
    title {
      processed
    }
    video {
      ...RemoteVideo
    }
  }
`);

export const STORY_QUOTE_FRAGMENT = gql(/* gql */ `
  fragment StoryQuote on ParagraphStoryQuote {
    __typename
    uuid
    id
    quoteContent: content
    quoteSource: source
    quoteDescription: description
    image {
      ...Image
    }
  }
`);

export const TABS_FRAGMENT = gql(/* gql */ `
  fragment Tabs on ParagraphSectionTab {
    __typename
    uuid
    id
    tabs {
      ... on ParagraphTabContent {
        body {
          processed
        }
        title
      }
    }
    sectionColumn {
      ...SectionColumn
    }
  }
`);

export const TESTIMONIAL_SLIDER_FRAGMENT = gql(/* gql */ `
  fragment TestimonialSlider on ParagraphTestimonialSlider {
    __typename
    uuid
    id
    title
    byTitle {
      __typename
      ...Testimonial
    }
    byTags {
      __typename
      ...Tag
    }
  }
`);

export const RELATED_CONTENT_FRAGMENT = gql(/* gql */ `
  fragment RelatedContent on ParagraphRelatedContent {
    __typename
    uuid
    id
    relatedContentHeadingLevel: headingLevel
    content {
      __typename
      ...BasicPageMinimal
    }
    label: contentLabel
  }
`);

export type FullFeaturedNews = Omit<FeaturedNewsFragment, "units"> & {
  isFull: true;
};

export type FullTestimonialSlider = Omit<TestimonialSliderFragment, "byTags"> & {
  isFull: true;
  byTags: TestimonialFragment[];
};

export type SectionWidget =
  | AccordionFragment
  | BlockFragment
  | ButtonSectionFragment
  | FeaturedNewsFragment
  | GeneralTextFragment
  | ImageOverlayFragment
  | LinksFragment
  | MediaTextFragment
  | ProfileBlockFragment
  | ProfileCardFragment
  | StatisticsFragment
  | TabsFragment
  | {
      __typename: "ParagraphYamlWidget";
    };

export type Widget =
  | AccordionFragment
  | BlockFragment
  | ButtonsFragment
  | ButtonSectionFragment
  | CallToActionFragment
  | FeaturedNewsFragment
  | GeneralTextFragment
  | ImageOverlayFragment
  | LinksFragment
  | MediaTextFragment
  | ModalVideoFragment
  | NewsSearchFragment
  | ProfileBlockFragment
  | ProfileCardFragment
  | SectionFragment
  | SocialMediaFragment
  | StatisticsFragment
  | StoryFragment
  | StoryModalVideoFragment
  | StoryQuoteFragment
  | TabsFragment
  | TestimonialSliderFragment
  | RelatedContentFragment
  | {
      __typename: "ParagraphYamlWidget";
    }
  | {
      __typename?: "ParagraphCallToAction";
    };

export type ProcessedSectionWidget = Exclude<SectionWidget, FeaturedNewsFragment> | FullFeaturedNews;

export type ProcessedSection = Omit<SectionFragment, "content"> & {
  content: ProcessedSectionWidget[];
};

export type ProcessedWidget =
  | Exclude<Widget, TestimonialSliderFragment | FeaturedNewsFragment | SectionFragment>
  | FullTestimonialSlider
  | FullFeaturedNews
  | ProcessedSection;

export class WidgetProcessor {
  public excludeNewsArticles: Set<string>;

  constructor() {
    this.excludeNewsArticles = new Set();
  }

  private async getFullFeaturedNews(data: FeaturedNewsFragment): Promise<FullFeaturedNews> {
    const units = data.units?.map((unit) => unit.id) ?? [];
    const categories = data.categories?.map((category) => category.id) ?? [];
    const tags = data.tags?.map((tag) => tag.id) ?? [];
    const allArticles = [];
    let articlesNeeded = data.count - (data.articles?.length ?? 0);

    for (const article of data.articles ?? []) {
      if (allArticles.length === 7) {
        break;
      }

      allArticles.push(article);
      this.excludeNewsArticles.add(article.id);
    }

    let page = 0;
    let totalPages = 1;

    while (articlesNeeded > 0 && allArticles.length < data.count && page < totalPages) {
      const extra = await getFilteredNews({
        page: page,
        pageSize: 10,
        units,
        categories,
        tags,
      });

      for (const article of extra.results) {
        if (this.excludeNewsArticles.has(article.id)) {
          continue;
        }

        if (allArticles.length >= data.count) {
          break;
        }

        allArticles.push(article);
        this.excludeNewsArticles.add(article.id);
        articlesNeeded--;
      }

      page++;
      totalPages = extra.totalPages;
    }

    return {
      ...data,
      isFull: true,
      articles: allArticles as NewsWithoutContentFragment[],
    };
  }

  private async getFullTestimonialSlider(data: TestimonialSliderFragment): Promise<FullTestimonialSlider> {
    const tags =
      data.byTags
        ?.map((tag) => (tag.__typename === "TermTag" ? tag.id : null))
        .filter((tag) => typeof tag === "string") ?? [];

    if (tags.length === 0) {
      return {
        ...data,
        isFull: true,
        byTags: [],
      };
    }

    return {
      ...data,
      isFull: true,
      byTags: await getTestimonialByTag(tags),
    } as FullTestimonialSlider;
  }

  public async processSectionWidget(widget: SectionWidget): Promise<ProcessedSectionWidget> {
    switch (widget.__typename) {
      case "ParagraphFeaturedNews":
        return await this.getFullFeaturedNews(widget);
      default:
        return widget;
    }
  }

  public async processWidget(widget: Widget): Promise<ProcessedWidget> {
    switch (widget.__typename) {
      case "ParagraphTestimonialSlider":
        return await this.getFullTestimonialSlider(widget);
      case "ParagraphSection":
        const sectionContent: ProcessedSectionWidget[] = [];

        for (const sectionWidget of widget.content) {
          sectionContent.push(await this.processSectionWidget(sectionWidget));
        }

        return {
          ...widget,
          content: sectionContent,
        };
      case "ParagraphFeaturedNews":
        return await this.getFullFeaturedNews(widget);
      default:
        return widget;
    }
  }

  public async processWidgets(widgets: Widget[]): Promise<ProcessedWidget[]> {
    const processed: ProcessedWidget[] = [];

    for (const widget of widgets) {
      processed.push(await this.processWidget(widget));
    }

    return processed;
  }
}
