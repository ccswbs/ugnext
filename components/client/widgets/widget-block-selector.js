import { AccordionWidget } from "@/components/client/widgets/accordions";
import { ButtonSectionWidget } from "@/components/client/widgets/button-section";
import { GeneralTextWidget } from "@/components/client/widgets/general-text";
import { MediaTextWidget } from "@/components/client/widgets/media-text";
import { SocialMediaWidget } from "@/components/client/widgets/social-media";
import { TabsWidget } from "@/components/client/widgets/tabs";

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