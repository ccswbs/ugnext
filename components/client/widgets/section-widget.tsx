import React from "react";
import { Section } from "@/components/client/section";
import { Typography } from "@uoguelph/react-components/typography";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { GroupedWidgets } from "@/components/client/widgets/media-widget-group";
import type { ProcessedSection, ProcessedSectionWidget, ProcessedWidget, Widget } from "@/data/drupal/widgets";
import { slugify } from "@/lib/string-utils";

interface SectionWidgetProps {
  data: ProcessedSection;
}

export function SectionWidget({ data }: SectionWidgetProps) {
  // Sort widgets into primary, secondary and others
  const sectionClasses = data?.classes;
  const {
    primary: ungroupedPrimary,
    secondary,
    others,
  } = data.content.reduce(
    (acc, widget, index) => {
      const columnName =
        (widget as any)?.buttonSectionColumn?.name ?? (widget as any)?.sectionColumn?.name ?? "primary";
      const column = columnName ? columnName.toLowerCase() : "";

      switch (column) {
        case "call to action":
          acc.primary.push(widget);
          break;
        case "primary":
          acc.primary.push(widget);
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
      primary: [] as ProcessedSectionWidget[],
      secondary: [] as React.ReactElement[],
      others: [] as React.ReactElement[],
    }
  ) ?? { primary: [], secondary: [], others: [] };

  const title = data.heading?.trim();

  return (
    <>
      {title && (
        <Typography
          id={slugify(title)}
          type={(data.headingLevel as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") || "h2"}
          as={(data.headingLevel as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") || "h2"}
        >
          {title}
        </Typography>
      )}

      {others.length > 0 && <div className="w-full text-center">{others}</div>}

      {(ungroupedPrimary.length > 0 || secondary.length > 0) && (
        <Section
          primary={<GroupedWidgets widgets={ungroupedPrimary} sectionClasses={sectionClasses} />}
          secondary={secondary}
          equal={sectionClasses === "col-md-6"}
        />
      )}
    </>
  );
}
