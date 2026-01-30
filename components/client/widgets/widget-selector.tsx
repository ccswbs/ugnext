"use client";

import { Container } from "@uoguelph/react-components/container";
import React, { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import { AccordionWidget } from "@/components/client/widgets/accordions";
import { ButtonSectionWidget } from "@/components/client/widgets/button-section";
import { GeneralTextWidget } from "@/components/client/widgets/general-text";
import { LinksWidget } from "@/components/client/widgets/links";
import { MediaTextWidget } from "@/components/client/widgets/media-text";
import { SectionWidget } from "@/components/client/widgets/section-widget";
import { StatisticsWidget } from "@/components/client/widgets/statistics";
import { ImageOverlayWidget } from "@/components/client/widgets/image-overlay";
import { StoryWidget } from "@/components/client/widgets/story";
import { BlockWidget } from "@/components/client/widgets/block";
import { TabsWidget } from "@/components/client/widgets/tabs";
import { TestimonialSliderWidget } from "@/components/client/widgets/testimonial-slider";
import { SocialMediaWidget } from "@/components/client/widgets/social-media";
import { ProfileBlock } from "@/components/client/widgets/profile-block";
import { ProfileCard } from "@/components/client/widgets/profile-card";
import type { Widgets } from "@/data/drupal/widgets";
import { usePathname } from "next/navigation";
import { ButtonWidget } from "@/components/client/widgets/button";

export function WidgetSelector({ data, neverWrap = false }: { data: Widgets; neverWrap?: boolean }) {
  const pathname = usePathname();

  // If this widget is within a section, we don't want to render a container around it
  const context = useContext(SectionContext);

  // Some widgets don't need extra vertical padding
  const noSpaceWidgets = [
    "ParagraphSectionButton",
    "ParagraphGeneralText",
    "ParagraphLinksWidget",
    "ParagraphBlockWidget",
  ];

  // Some widgets need to span the full width of the page
  const noWrapWidgets = [
    "ParagraphTestimonialSlider",
    "ParagraphImageOverlay",
    "ParagraphStoryWidget",
    "ParagraphProfileBlock",
  ];

  if (!data.__typename) {
    console.error(`Widget Error: encountered a widget with no __typename\n`);

    return <></>;
  }

  const Widget = () => {
    switch (data.__typename) {
      case "ParagraphAccordionSection":
        return <AccordionWidget data={data} />;
      case "ParagraphButtonWidget":
        return <ButtonWidget data={data} column={"primary"} />;
      case "ParagraphSectionButton":
        return <ButtonSectionWidget data={data} />;
      case "ParagraphGeneralText":
        return <GeneralTextWidget data={data} />;
      case "ParagraphLinksWidget":
        return <LinksWidget data={data} />;
      case "ParagraphMediaText":
        return <MediaTextWidget data={data} />;
      case "ParagraphTestimonialSlider":
        return <TestimonialSliderWidget data={data} />;
      case "ParagraphSection":
        return <SectionWidget data={data} />;
      case "ParagraphSectionTab":
        return <TabsWidget data={data} />;
      case "ParagraphStatisticWidget":
        return <StatisticsWidget data={data} />;
      case "ParagraphImageOverlay":
        return <ImageOverlayWidget data={data} />;
      case "ParagraphStoryWidget":
        return <StoryWidget data={data} />;
      case "ParagraphBlockWidget":
        return <BlockWidget data={data} />;
      case "ParagraphSocialMediaWidget":
        return <SocialMediaWidget data={data} />;
      case "ParagraphProfileBlock":
        return <ProfileBlock data={data} />;
      case "ParagraphProfileCard":
        return <ProfileCard data={data} />;

      default:
        console.error(`Widget Error: ${data.__typename} is not a supported widget\n\t@ ${pathname}\n`);
        return <></>;
    }
  };

  // Add spacing wrapper for certain widgets within sections
  const SpacingWrapper = ({ children }: { children: React.ReactNode }) => {
    if (noSpaceWidgets.includes(data.__typename || "") || !context) {
      return <>{children}</>;
    }
    return <div className="py-4">{children}</div>;
  };

  if (!noWrapWidgets.includes(data.__typename || "") && !context && !neverWrap) {
    return (
      <Container>
        <Widget />
      </Container>
    );
  }

  return (
    <SpacingWrapper>
      <Widget />
    </SpacingWrapper>
  );
}
