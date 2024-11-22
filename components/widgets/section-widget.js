import { Section as SectionComponent } from "@/components/section";
import { Heading } from "@/components/heading";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import { getHeadingLevel } from "@/lib/string-utils";

export const Section = ({ data }) => {
  // Sort widgets into primary, secondary and others
  const {
    primary: ungroupedPrimary,
    secondary,
    others,
  } = data?.content?.reduce(
    (acc, widget, index) => {
      const columnName = widget?.buttonSectionColumn?.name ?? widget?.sectionColumn?.name ?? "primary";
      const column = columnName ? columnName.toLowerCase() : "";

      switch (column) {
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
      primary: [],
      secondary: [],
      others: [],
    }
  );

  const primary = ungroupedPrimary.reduce((acc, widget, index) => {
    // Only media text widgets can be grouped, add all other widgets to the primary array
    if (widget?.__typename !== "ParagraphMediaText") {
      acc.push(widget);
      return acc;
    }

    // Check if the previous widget is a media text widget group
    const previous = acc[acc.length - 1];

    if (Array.isArray(previous) && widget?.mediaImageSize === previous[0]?.mediaImageSize) {
      // The current media text widget has the same size as the ones in a group before it, add the widget to the group
      previous.push(widget);
      return acc;
    }

    // There is no previous group or the current media text widget has a different size, create a new group
    acc.push([widget]);
    return acc;
  }, []);

  return (
    <>
      {data.heading && <Heading level={getHeadingLevel(data.headingLevel) ?? 1}>{data.heading}</Heading>}

      {others.length > 0 && <div className="w-full text-center">{others}</div>}

      {(primary.length > 0 || secondary.length > 0) && (
        <SectionComponent
          primary={primary.map((widget, index) => {
            if (Array.isArray(widget)) {
              if (widget.length === 1) {
                return <WidgetSelector key={index} data={widget[0]} />;
              }

              return (
                <div key={index} className="sm:flex gap-4">
                  {widget.map((w, i) => (
                    <div key={i} className="sm:flex-1">
                      <WidgetSelector data={w} />
                    </div>
                  ))}
                </div>
              );
            }

            return <WidgetSelector key={index} data={widget} />;
          })}
          secondary={secondary}
        />
      )}
    </>
  );
};
