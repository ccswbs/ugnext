import { getCustomFooterByTagsOrUnits } from "@/data/drupal/custom-footer";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import { HtmlParser } from "@/components/client/html-parser";
import Image from "next/image";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import React from "react";

export type CustomFooterProps = {
  tags?: string[];
  units?: string[];
};

export async function CustomFooter({ tags, units }: CustomFooterProps) {
  const content = await getCustomFooterByTagsOrUnits(tags ?? [], units ?? []);

  if (!content) {
    return <></>;
  }

  const classes = tv({
    slots: {
      base: "w-full py-5 bg-grey-light-bg",
      content: "xs:col-start-2",
      main: "grid gap-4 xs:grid xs:grid-cols-2 md:grid-cols-[2fr_5fr] content-start",
    },
  })();

  return (
    <div className={classes.base()}>
      <Container>
        <div className={classes.main()}>
          {content.footerLogo?.map((image) => (
            <Image
              key={image.image.url}
              src={image.image.url}
              alt={image.image.alt ?? ""}
              width={image.image.width}
              height={image.image.height}
              className={"sm:pr-5"}
            />
          ))}
          <div className={classes.content()}>
            <HtmlParser html={content.body?.processed ?? ""} instructions={undefined} />
          </div>
        </div>
        <div>
          {content?.widgets?.map((widget, index) => (
            <WidgetSelector key={index} data={widget} />
          ))}
        </div>
      </Container>
    </div>
  );
}
