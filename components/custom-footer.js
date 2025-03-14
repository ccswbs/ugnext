import { Container } from "@/components/container";
import { HtmlParser } from "@/components/html-parser";
import Image from "next/image";
import { WidgetSelector } from "@/components/widgets/widget-selector";

export const CustomFooter = ({ custfoot }) => {

  return (
    <div className="bg-gray-50">
      <Container className="" centered="true">
        {custfoot?.customFooterByTag.results.map((customFoot) => (
          <div key={customFoot.id}>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Image
                  src={customFoot.footerLogo[0].image.url}
                  width={customFoot.footerLogo[0].image.width}
                  height={customFoot.footerLogo[0].image.height}
                  alt={customFoot.footerLogo[0].image.alt}
                  placeholder={customFoot.footerLogo[0].image.blurred ? "blur" : "empty"}
                  blureDataURL={customFoot.footerLogo[0].image.blurred}
                />
              </div>
              <div className="col-span-2">
                <HtmlParser html={customFoot.body.processed} />
              </div>
            </div>
            {customFoot?.widgets?.map((widget, index) => (
              <WidgetSelector key={index} data={widget} />
            ))}
          </div>
        ))}
      </Container>
    </div>
  );
};
