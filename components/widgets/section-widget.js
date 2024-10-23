import { Section as SectionComponent } from "@/components/section";
import { Heading } from "@/components/heading";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import { getHeadingLevel } from "@/lib/string-utils";

export const Section = ({ data }) => {
  const { primary, secondary, others } = data?.content?.reduce(
    (acc, widget, index) => {
      const columnName = widget?.buttonSectionColumn?.name ?? widget?.sectionColumn?.name;
      const column = columnName ? columnName.toLowerCase() : "";

      switch (column) {
        case "primary":
          // Media and Text widgets need to be grouped together when in a primary column, so we will process primary widgets later.
          acc.primary.push(<WidgetSelector key={index} data={widget} />);
          break;
        case "secondary":
          acc.secondary.push(<WidgetSelector key={index} data={widget} />);
          break;
        default:
          acc.others.push(<WidgetSelector key={index} data={widget} />);
          break;
      }

      return acc;
    },
    {
      primary: [],
      secondary: [],
      others: [],
    }
  );

  return (
    <>
      {data.heading && <Heading level={getHeadingLevel(data.headingLevel) ?? 1}>{data.heading}</Heading>}

      {others.length > 0 && <div className="w-full text-center">{...others}</div>}

      {(primary.length > 0 || secondary.length > 0) && <SectionComponent primary={primary} secondary={secondary} />}
    </>
  );
};
