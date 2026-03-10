import React, { Fragment } from "react";
import { nanoid } from "nanoid";
import { Info } from "@uoguelph/react-components/info";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const AuthorInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props) => (props.className as string)?.includes("author"),
  processNode: (node, props, children) => {
    return (
      <Fragment key={nanoid()}>
        <div className="mt-4"></div>
        <Info color="yellow">
          {React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type !== "br")}
        </Info>
      </Fragment>
    );
  },
};
