import React, { Fragment } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ParagraphInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "p",
  processNode: (node, props, children) => {
    const className = typeof props.className === "string" ? props.className : "";
    // Replace certain classes
    let replacedClasses = {
      lead: "text-2xl font-light leading-[1.5]",
    };

    let updatedClassname = className;
    Object.entries(replacedClasses).forEach(([key, value]) => {
      updatedClassname = updatedClassname.replace(key, value);
    });

    const hasInvalidChildren = React.Children.toArray(children).some((child) => {
      if (!React.isValidElement(child)) {
        return false;
      }

      switch (child.type) {
        case "figure":
          return true;
        default:
          return false;
      }
    });

    if (hasInvalidChildren) {
      return <Fragment key={nanoid()}>{children}</Fragment>;
    }

    return (
      <Typography
        {...props}
        key={nanoid()}
        type="body"
        as="p"
        className={twMerge("group-first/html-parser:first:mt-0", updatedClassname)}
      >
        {children}
      </Typography>
    );
  },
};
