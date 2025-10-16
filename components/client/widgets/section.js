import { Section } from "@/components/client/section";
import { Typography } from "@uoguelph/react-components/typography";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { Grid } from "@uoguelph/react-components/grid";

// Create a grid if only media + text widgets in Primary section
// default is two columns; if more, then 3 or 4 columns
function renderMediaGrid(numElements, sectionClasses) {
  let mediaGridTemplate = {
    base: ["1fr"],
    sm: ["1fr", "1fr"],
  };

  // if section has col-md-6 in classes, use two columns
  if (sectionClasses && sectionClasses.includes("col-md-6")) {
    return mediaGridTemplate;
  }

  if (numElements > 1) {
    let gridDivision = ["1fr", "1fr"];
    if (numElements > 2) {
      gridDivision = numElements % 4 === 0 ? ["1fr", "1fr", "1fr", "1fr"] : ["1fr", "1fr", "1fr"];
    }
    mediaGridTemplate.sm = gridDivision;
  }

  return mediaGridTemplate;
}

export function SectionWidget({ data }) {
  // Sort widgets into primary, secondary and others
  const sectionClasses = data?.classes;
  const {
    primary: ungroupedPrimary,
    secondary,
    others,
  } = data?.content?.reduce(
    (acc, widget, index) => {
      const columnName = widget?.buttonSectionColumn?.name ?? widget?.sectionColumn?.name ?? "primary";
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
      {data.heading && (
        <Typography id={`section-heading-${data.uuid}`} type={data.headingLevel ?? "h2"} as={data.headingLevel ?? "h2"}>
          {data.heading}
        </Typography>
      )}

      {others.length > 0 && <div className="w-full text-center">{others}</div>}

      {(primary.length > 0 || secondary.length > 0) && (
        <Section
          primary={primary.map((widget, index) => {
            if (Array.isArray(widget)) {
              if (widget.length === 1) {
                return <WidgetSelector key={index} data={widget[0]} />;
              }

              // Handle Media Grid Layout
              if (widget[0].__typename === "ParagraphMediaText") {
                return (
                  <Grid key={index} className="gap-4" template={renderMediaGrid(widget.length, sectionClasses)}>
                    {widget.map((w, i) => (
                      <WidgetSelector data={w} key={i} />
                    ))}
                  </Grid>
                );
              }

              // Default Section Widget Layout
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
          equal={sectionClasses === "col-md-6"}
        />
      )}

      
    </>
  );
}
