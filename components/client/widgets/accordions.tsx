import { Accordion, AccordionButton, AccordionContent } from "@uoguelph/react-components/accordion";
import { HtmlParser } from "@/components/client/html-parser";
import { getHeadingLevel, slugify } from "@/lib/string-utils";
import { Typography, TypographyProps } from "@uoguelph/react-components/typography";
import type { AccordionFragment } from "@/lib/graphql/types";

export function AccordionWidget({ data }: { data: AccordionFragment }) {
  const level = data.headingLevel ? (getHeadingLevel(data.headingLevel) ?? 3) : 2;
  const sectionTitle = data?.accordionSectionTitle;
  const id = sectionTitle ? slugify(sectionTitle) : `accordions-heading-${data.uuid}`;
  const sectionDescription = data?.accordionDescription?.processed;

  return (
    <>
      {sectionTitle && (
        <Typography
          id={id}
          type={`h${level}` as TypographyProps<any>["type"]}
          as={`h${level}` as TypographyProps<any>["as"]}
        >
          {sectionTitle}
        </Typography>
      )}
      {sectionDescription && <HtmlParser html={sectionDescription} />}

      {data?.items.map((item, index) => (
        <Accordion id={`accordion-${item.uuid}`} key={index}>
          <AccordionButton>{item.accordionTitle}</AccordionButton>
          <AccordionContent>
            <HtmlParser html={item.text.processed} />
          </AccordionContent>
        </Accordion>
      ))}
    </>
  );
}
