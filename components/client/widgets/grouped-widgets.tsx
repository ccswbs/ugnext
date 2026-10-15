"use client";

import { useContext } from "react";
import { Grid } from "@uoguelph/react-components/grid";
import { SectionContext } from "@/components/client/section";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { MediaGridContext } from "@/components/client/widgets/media-grid-context";
import type { MediaTextFragment } from "@/lib/graphql/types";

export { MediaGridContext };

// Create a grid template for a group of media + text widgets.
// Considers both number of elements and their size settings.
export function renderMediaGrid(widgetGroup: MediaTextFragment | MediaTextFragment[], sectionClasses?: string | null) {
  let mediaGridTemplate = {
    base: ["1fr"],
    sm: ["1fr", "1fr"],
  };

  // If section has col-md-6 in classes, use two columns max
  if (sectionClasses && sectionClasses.includes("col-md-6")) {
    return mediaGridTemplate;
  }

  const numElements = Array.isArray(widgetGroup) ? widgetGroup.length : 1;

  if (numElements === 1) {
    return mediaGridTemplate;
  }

  const firstWidget = Array.isArray(widgetGroup) ? widgetGroup[0] : widgetGroup;
  const mediaSize = firstWidget?.mediaImageSize;

  let maxColumns = 2;

  if (mediaSize && (mediaSize === "small" || mediaSize === "medium" || mediaSize === "large")) {
    maxColumns = 2;
  } else {
    if (numElements > 2) {
      maxColumns = numElements % 4 === 0 ? 4 : 3;
    } else {
      maxColumns = 2;
    }
  }

  if (numElements > 1) {
    const gridDivision = Array(Math.min(maxColumns, numElements)).fill("1fr");
    mediaGridTemplate.sm = gridDivision;
  }

  return mediaGridTemplate;
}

type GroupableWidget = { __typename?: string | null; id?: string; mediaImageSize?: string | null };

// Register widget types that should be grouped into a grid layout when consecutive.
// Each type listed here will be grouped by consecutive same-typename runs.
// Add new groupable types here as needed; rendering logic lives in GroupedWidgets.
const GRID_GROUPED_TYPES = new Set(["ParagraphMediaText"]);

// Groups consecutive widgets of the same grid-groupable type into arrays.
// ParagraphMediaText widgets are additionally sub-grouped by mediaImageSize.
// All other widget types are left ungrouped (passed through as-is).
export function groupWidgetsForGrid<T extends GroupableWidget>(widgets: T[]): Array<T | T[]> {
  return widgets.reduce(
    (acc, widget) => {
      if (!widget?.__typename || !GRID_GROUPED_TYPES.has(widget.__typename)) {
        acc.push(widget);
        return acc;
      }

      const previous = acc[acc.length - 1];

      if (
        Array.isArray(previous) &&
        previous[0]?.__typename === widget.__typename &&
        widget?.mediaImageSize === (previous[0] as GroupableWidget)?.mediaImageSize
      ) {
        previous.push(widget);
        return acc;
      }

      acc.push([widget]);
      return acc;
    },
    [] as Array<T | T[]>
  );
}

interface GroupedWidgetsProps {
  widgets: GroupableWidget[];
  sectionClasses?: string | null;
  neverWrap?: boolean;
}

// Renders a flat list of widgets, automatically grouping consecutive
// ParagraphMediaText widgets of the same size into a Grid layout.
// Grid grouping only applies when rendered inside a Section.
export function GroupedWidgets({ widgets, sectionClasses, neverWrap = false }: GroupedWidgetsProps) {
  const context = useContext(SectionContext);
  const grouped = context ? groupWidgetsForGrid(widgets) : widgets;

  return (
    <>
      {grouped.map((widget, index) => {
        if (Array.isArray(widget)) {
          if (widget.length === 1) {
            return <WidgetSelector key={index} data={widget[0] as any} neverWrap={neverWrap} />;
          }

          if (widget[0].__typename === "ParagraphMediaText") {
            return (
              <MediaGridContext.Provider key={index} value={true}>
                <Grid className="py-2 gap-4 items-stretch" template={renderMediaGrid(widget as MediaTextFragment[], sectionClasses)}>
                  {widget.map((w, i) => (
                    <WidgetSelector data={w as any} key={i} neverWrap={neverWrap} />
                  ))}
                </Grid>
              </MediaGridContext.Provider>
            );
          }

          // Default layout for other grouped widget types
          return (
            <div key={index} className="sm:flex gap-4">
              {widget.map((w, i) => (
                <div key={i} className="sm:flex-1">
                  <WidgetSelector data={w as any} neverWrap={neverWrap} />
                </div>
              ))}
            </div>
          );
        }

        return <WidgetSelector key={index} data={widget as any} neverWrap={neverWrap} />;
      })}
    </>
  );
}
