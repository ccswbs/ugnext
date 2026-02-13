import React from "react";
import { Section } from "@/components/client/section";
import { Typography } from "@uoguelph/react-components/typography";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { Grid } from "@uoguelph/react-components/grid";
import type { SectionFragment } from "@/lib/graphql/types";
import type { Widgets } from "@/data/drupal/widgets";
import { slugify } from "@/lib/string-utils";

interface MediaTextWidget {
  __typename: "ParagraphMediaText";
  mediaImageSize?: string;
  uuid: string;
}

interface SectionWidgetProps {
  data: SectionFragment;
}

// Create a grid if only media + text widgets in Primary section
// Considers both number of elements and their size settings
function renderMediaGrid(widgetGroup: MediaTextWidget | MediaTextWidget[], sectionClasses?: string | null) {
  let mediaGridTemplate = {
    base: ["1fr"],
    sm: ["1fr", "1fr"],
  };

  // If section has col-md-6 in classes, use two columns max
  if (sectionClasses && sectionClasses.includes("col-md-6")) {
    return mediaGridTemplate;
  }

  const numElements = Array.isArray(widgetGroup) ? widgetGroup.length : 1;

  // If only one element, return default
  if (numElements === 1) {
    return mediaGridTemplate;
  }

  // Determine optimal columns based on media size
  const firstWidget = Array.isArray(widgetGroup) ? widgetGroup[0] : widgetGroup;
  const mediaSize = firstWidget?.mediaImageSize;

  let maxColumns = 2; // default

  if (mediaSize && (mediaSize === "small" || mediaSize === "medium" || mediaSize === "large")) {
    // When size is explicitly set (small, medium, large), use 2 columns
    // due to caption placement considerations
    maxColumns = 2;
  } else {
    // When no size is set, use original logic with remainder handling
    if (numElements > 2) {
      maxColumns = numElements % 4 === 0 ? 4 : 3;
    } else {
      maxColumns = 2;
    }
  }

  // Apply the column layout
  if (numElements > 1) {
    const gridDivision = Array(Math.min(maxColumns, numElements)).fill("1fr");
    mediaGridTemplate.sm = gridDivision;
  }

  return mediaGridTemplate;
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
          acc.secondary.push(<WidgetSelector key={index} data={widget as Widgets} />);
          break;
        default:
          acc.others.push(<WidgetSelector key={index} data={widget as Widgets} />);
          break;
      }

      return acc;
    },
    {
      primary: [] as Array<SectionFragment["content"][0]>,
      secondary: [] as React.ReactElement[],
      others: [] as React.ReactElement[],
    }
  ) ?? { primary: [], secondary: [], others: [] };

  const primary = ungroupedPrimary.reduce(
    (acc, widget, index) => {
      // Only media text widgets can be grouped, add all other widgets to the primary array
      if (widget?.__typename !== "ParagraphMediaText") {
        acc.push(widget);
        return acc;
      }

      // Check if the previous widget is a media text widget group
      const previous = acc[acc.length - 1];

      if (Array.isArray(previous) && (widget as any)?.mediaImageSize === (previous[0] as any)?.mediaImageSize) {
        // The current media text widget has the same size as the ones in a group before it, add the widget to the group
        previous.push(widget as MediaTextWidget);
        return acc;
      }

      // There is no previous group or the current media text widget has a different size, create a new group
      acc.push([widget as MediaTextWidget]);
      return acc;
    },
    [] as Array<SectionFragment["content"][0] | MediaTextWidget[]>
  );

  const title = data.heading?.trim();

  console.log(data);

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

      {(primary.length > 0 || secondary.length > 0) && (
        <Section
          primary={primary.map((widget, index) => {
            if (Array.isArray(widget)) {
              if (widget.length === 1) {
                return <WidgetSelector key={index} data={widget[0] as Widgets} />;
              }

              // Handle Media Grid Layout
              if (widget[0].__typename === "ParagraphMediaText") {
                return (
                  <Grid key={index} className="gap-4" template={renderMediaGrid(widget, sectionClasses)}>
                    {widget.map((w, i) => (
                      <WidgetSelector data={w as Widgets} key={i} />
                    ))}
                  </Grid>
                );
              }

              // Default Section Widget Layout
              return (
                <div key={index} className="sm:flex gap-4">
                  {widget.map((w, i) => (
                    <div key={i} className="sm:flex-1">
                      <WidgetSelector data={w as Widgets} />
                    </div>
                  ))}
                </div>
              );
            }

            return <WidgetSelector key={index} data={widget as Widgets} />;
          })}
          secondary={secondary}
          equal={sectionClasses === "col-md-6"}
        />
      )}
    </>
  );
}
