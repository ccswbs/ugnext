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

    // Detect CKEditor's &nbsp; spacing hack: whitespace-only children inside the icon
    const hasWhitespaceOnlyChildren =
      (node.children?.length ?? 0) > 0 &&
      node.children.every((child) => child.type === "text" && (child as any).data?.trim() === "");

    // Map legacy Bootstrap/custom color class names to Tailwind equivalents
    const colorClassMap: Record<string, string> = {
      green: "text-green-600",
      red: "text-red-600",
      blue: "text-blue-600",
      yellow: "text-yellow-500",
    };
    const remappedClassName = className
      .split(/\s+/)
      .map((cls) => colorClassMap[cls] ?? cls)
      .join(" ");

    const classes = twMerge(
      remappedClassName,
      className.includes("fs-1") && "sm:text-3xl p-0",
      (hasInlineNextSibling || hasWhitespaceOnlyChildren) && "mr-[0.3em]",
      hasInlinePreSibling && "ml-[0.3em]"
    );

    return (
      <i {...props} key={nanoid()} aria-hidden="true" className={classes}>
        {hasWhitespaceOnlyChildren ? null : children}
      </i>
    );
  },
};
