import { AccordionWidget } from "@/components/widgets/accordions";
import { ButtonSectionWidget } from "@/components/widgets/button-section";
import { GeneralTextWidget } from "@/components/widgets/general-text";
import { MediaTextWidget } from "@/components/widgets/media-text";
import { SocialMediaWidget } from "@/components/widgets/social-media";
import { TabsWidget } from "@/components/widgets/tabs";

export const WidgetBlockSelector = ({ data }) => {
  const map = {
    ParagraphAccordionSection: AccordionWidget,
    ParagraphSectionButton: ButtonSectionWidget,
    ParagraphGeneralText: GeneralTextWidget,
    ParagraphMediaText: MediaTextWidget,
    ParagraphSectionTab: TabsWidget,
    ParagraphSocialMediaWidget: SocialMediaWidget,
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