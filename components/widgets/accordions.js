import { Accordion, AccordionButton, AccordionContent } from "@uoguelph/react-components/accordion";
import { HtmlParser } from "@/components/html-parser";
import { Heading } from "@/components/heading";
import { getHeadingLevel } from "@/lib/string-utils";

export const Accordions = ({ data }) => {
  const level = getHeadingLevel(data.headingLevel);

  return (
    <>
      {data?.accordionSectionTitle && <Heading level={level}>{data?.accordionSectionTitle}</Heading>}

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
};
