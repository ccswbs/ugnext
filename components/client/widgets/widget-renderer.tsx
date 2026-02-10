"use client";

import React from "react";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { ProfileCardGroup } from "@/components/client/widgets/profile-card-group";
import type { Widgets } from "@/data/drupal/widgets";
import type { ProfileCardFragment } from "@/lib/graphql/types";

/**
 * WidgetRenderer - Enhanced widget renderer that can group consecutive ProfileCard widgets 
 * into CSS multicolumn layouts.
 * 
 * Usage examples:
 * 
 * // Default responsive multicolumn layout (1 col on mobile, 2 on tablet/desktop)
 * <WidgetRenderer widgets={widgets} />
 * 
 * // Custom column counts
 * <WidgetRenderer 
 *   widgets={widgets} 
 *   profileCardColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
 * />
 * 
 * // Fixed column count
 * <WidgetRenderer widgets={widgets} profileCardColumns={2} />
 * 
 * // Custom gap and styling
 * <WidgetRenderer 
 *   widgets={widgets} 
 *   profileCardGap="2rem"
 *   profileCardClassName="my-custom-profile-grid"
 * />
 * 
 * // Disable grouping to render ProfileCards individually
 * <WidgetRenderer widgets={widgets} groupProfileCards={false} />
 */

interface WidgetRendererProps {
  widgets: Widgets[];
  groupProfileCards?: boolean;
  profileCardColumns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  profileCardGap?: string;
  profileCardClassName?: string;
}

export function WidgetRenderer({ 
  widgets, 
  groupProfileCards = true,
  profileCardColumns = { sm: 1, md: 2, lg: 2, xl: 2 },
  profileCardGap = "1.5rem",
  profileCardClassName = ""
}: WidgetRendererProps) {
  if (!groupProfileCards) {
    // If grouping is disabled, render widgets normally
    return (
      <>
        {widgets.map((widget, index) => (
          <WidgetSelector key={index} data={widget} />
        ))}
      </>
    );
  }

  const processedWidgets: React.ReactNode[] = [];
  let i = 0;

  while (i < widgets.length) {
    const widget = widgets[i];

    if (widget.__typename === "ParagraphProfileCard") {
      // Found a ProfileCard, look for consecutive ProfileCards
      const profileCardGroup: ProfileCardFragment[] = [];
      let j = i;

      while (j < widgets.length && widgets[j].__typename === "ParagraphProfileCard") {
        profileCardGroup.push(widgets[j] as ProfileCardFragment);
        j++;
      }

      // Render the group of ProfileCards
      processedWidgets.push(
        <ProfileCardGroup
          key={`profile-card-group-${i}`}
          cards={profileCardGroup}
          columns={profileCardColumns}
          gap={profileCardGap}
          className={profileCardClassName}
        />
      );

      // Skip the widgets we just processed
      i = j;
    } else {
      // Not a ProfileCard, render normally
      processedWidgets.push(
        <WidgetSelector key={i} data={widget} />
      );
      i++;
    }
  }

  return <>{processedWidgets}</>;
}