import { Accordion, AccordionButton, AccordionContent } from "@uoguelph/react-components/accordion";
import { HtmlParser } from "@/components/client/html-parser";
import { getHeadingLevel } from "@/lib/string-utils";
import { Typography } from "@uoguelph/react-components/typography";

export function AccordionWidget({ data }) {
  const level = getHeadingLevel(data.headingLevel);
  const sectionTitle = data?.accordionSectionTitle;

  return (
    <>
      {sectionTitle && (
        <Typography id={`accordions-heading-${data.uuid}`} type={`h${level}`}>
          {sectionTitle}
        </Typography>
      )}

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
