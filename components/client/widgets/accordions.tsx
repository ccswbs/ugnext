import { Accordion, AccordionButton, AccordionContent } from "@uoguelph/react-components/accordion";
import { HtmlParser } from "@/components/client/html-parser";
import { getHeadingLevel } from "@/lib/string-utils";
import { Typography } from "@uoguelph/react-components/typography";
import type { AccordionFragment } from "@/lib/graphql/types";

export function AccordionWidget({ data }: { data: AccordionFragment }) {
  const level = getHeadingLevel(data.headingLevel) ?? 2;
  const sectionTitle = data?.accordionSectionTitle;

  return (
    <>
      {sectionTitle && (
        <Typography id={data.id} type={`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}>
          {sectionTitle}
        </Typography>
      )}

      {data?.items.map((item, index) => (
        <Accordion key={index}>
          <AccordionButton>{item.accordionTitle}</AccordionButton>
          <AccordionContent>
            <HtmlParser html={item.text.processed} />
          </AccordionContent>
        </Accordion>
      ))}
    </>
  );
}
