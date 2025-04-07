import { Accordions } from "@/components/widgets/accordions";
import { ButtonSection } from "@/components/widgets/button-section";
import { GeneralText } from "@/components/widgets/general-text";
import { MediaText } from "@/components/widgets/media-text";
import { SocialMedia } from "@/components/widgets/social-media";
import { Tabs } from "@/components/widgets/tabs";

export const WidgetBlockSelector = ({ data }) => {
  const map = {
    ParagraphAccordionSection: Accordions,
    ParagraphSectionButton: ButtonSection,
    ParagraphGeneralText: GeneralText,
    ParagraphMediaText: MediaText,
    ParagraphSectionTab: Tabs,
    ParagraphSocialMedia: SocialMedia,
  };

  return (
    <>
      {data.map((item, index) => {
        const Widget = map[item.__typename];
        return Widget ? <Widget key={index} data={item} /> : null;
      })}
    </>
  );
};