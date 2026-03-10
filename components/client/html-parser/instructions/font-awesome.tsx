import { nanoid } from "nanoid";
import { ElementType } from "domelementtype";
import { twMerge } from "tailwind-merge";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const FontAwesomeInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node, props) => {
    if (node.tagName !== "i" && node.tagName !== "span") {
      return false;
    }

    const className = (props.className as string) ?? "";

    // Match against Font Awesome classes like fas or fa-solid
    return /\b(fa[srlbdt]?|fa-[a-z0-9-]+)\b/g.test(className);
  },
  processNode: (node, props, children) => {
    const className = (props.className as string) ?? "";

    const inlineTags = new Set(["i", "span", "a"]);
    const hasInlineNextSibling =
      node.next?.type === "text" || (node.next?.type === ElementType.Tag && inlineTags.has(node.next?.tagName));
    const hasInlinePreSibling =
      node.prev?.type === "text" || (node.prev?.type === ElementType.Tag && inlineTags.has(node.prev?.tagName));

    const classes = twMerge(
      props.className as string,
      className.includes("fs-1") && "sm:text-3xl p-0",
      hasInlineNextSibling && "mr-[0.3em]",
      hasInlinePreSibling && "ml-[0.3em]"
    );

    return (
      <i {...props} key={nanoid()} aria-hidden="true" className={classes}>
        {children}
      </i>
    );
  },
};
