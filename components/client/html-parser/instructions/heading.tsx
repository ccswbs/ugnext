import { nanoid } from "nanoid";
import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import { clamp } from "@uoguelph/react-components";
import { HTMLParserInstruction, unwrapTags } from "@/components/client/html-parser";

export const HeadingInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => {
    switch (node.tagName) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return true;
      default:
        return false;
    }
  },
  processNode: (node, props, children) => {
    const level = node.tagName as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const className = typeof props.className === "string" ? props.className : "";
    const headingClass = className.match(/\bh\d\b/g);
    const displayClass = /\bdisplay-(\d)\b/g.exec(className);
    const cleanedChildren = unwrapTags(children);

    const isFAIconNode = (child: any) =>
      child?.type === "tag" && child.tagName === "i" && /\b(fa[srlbdt]?|fa-[a-z0-9-]+)\b/.test(child.attribs?.class ?? "");
    const firstMeaningfulDOMChild = node.children?.find(
      (child) => !(child.type === "text" && (child as any).data?.trim() === "")
    );
    const startsWithIcon =
      isFAIconNode(firstMeaningfulDOMChild) ||
      ((firstMeaningfulDOMChild as any)?.tagName === "em" &&
        (firstMeaningfulDOMChild as any)?.children?.some(isFAIconNode));

    let type = level;
    let emphasize = false;

    // Allow headings to appear smaller if needed
    if (headingClass) {
      type = headingClass[0] as "h3" | "h4" | "h5" | "h6";
    }

    if (displayClass) {
      const size = clamp(Number.parseInt(displayClass[1]), 1, 6);

      if (size) {
        type = `h${size}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        emphasize = true;
      }
    }

    return (
      <Typography
        {...props}
        key={nanoid()}
        type={type}
        as={level}
        emphasize={emphasize}
        className={twMerge("group-first/html-parser:first:mt-0", startsWithIcon && "flex items-baseline gap-[0.4em]", className)}
      >
        {cleanedChildren}
      </Typography>
    );
  },
};
