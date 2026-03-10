import React from "react";
import { Grid } from "@uoguelph/react-components/grid";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const RowInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props) => /\brow\b/.test(props.className as string),
  processNode: (node, props, children) => {
    interface TemplateValues {
      [key: string]: string[] | undefined;
    }
    let templateValues: TemplateValues = {
      base: ["1fr"],
      md: undefined,
      sm: undefined,
      xl: undefined,
    };

    let convertedGrid: string[] = [];

    {
      React.Children.map(children, (child) => {
        // Parse divs with Boostrap column classes
        if (typeof child !== "string" && child.type === "div") {
          let bsClasses = child.props.className;

          // console.log("Converting:" + bsClasses);

          // Assumes Bootstrap format can be col, col-6, col-md, or col-md-6
          if (bsClasses?.includes("col")) {
            let bsColumnClasses: string[] = bsClasses.split(" ");

            bsColumnClasses.forEach((columnClass) => {
              // Parse bootstrap columns and viewports
              let bootstrapClassParts = columnClass.replace("col", "");
              let bootstrapNumColumns = bootstrapClassParts.match(/\d+/g);
              let bootstrapViewport = bootstrapClassParts.match(/[A-Za-z]+/g);

              if (columnClass === "col" || bootstrapNumColumns === null) {
                convertedGrid.push("1fr");
              } else {
                // Convert bootstrap columns
                switch (bootstrapNumColumns[0]) {
                  case "3":
                    convertedGrid = ["1fr", "1fr", "1fr"];
                    break;
                  case "4":
                    convertedGrid = ["1fr", "1fr", "1fr", "1fr"];
                    break;
                  case "6":
                    convertedGrid = ["1fr", "1fr"];
                    break;
                  default:
                    convertedGrid = ["1fr"];
                }
              }

              if (bootstrapViewport) {
                // Convert bootstrap viewports
                switch (bootstrapViewport[0]) {
                  case "xs":
                  case "sm":
                    templateValues.sm = convertedGrid;
                    break;
                  case "md":
                  case "lg":
                    templateValues.md = convertedGrid;
                    break;
                  case "xl":
                  case "xxl":
                    templateValues.xl = convertedGrid;
                    break;
                  default:
                    templateValues.md = convertedGrid;
                }
              } else {
                // default viewport for col classes
                templateValues.sm = convertedGrid;
              }
            });
          }
        }
      });
    }

    // Remove undefined values
    Object.keys(templateValues).forEach((key) => {
      if (templateValues[key] === undefined) {
        delete templateValues[key];
      }
    });

    // console.log(templateValues);

    return (
      <Grid className="gap-4 pb-4" template={templateValues}>
        {children}
      </Grid>
    );
  },
};
