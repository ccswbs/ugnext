"use client";

import parse, { attributesToProps, type DOMNode, domToReact, Element, HTMLReactParserOptions } from "html-react-parser";
import React, { isValidElement, ReactElement, ReactNode, useMemo } from "react";
import { nanoid } from "nanoid";
import { AuthorInstruction } from "@/components/client/html-parser/instructions/author";
import { BlockquoteInstruction } from "@/components/client/html-parser/instructions/blockquote";
import { CollapseInstruction } from "@/components/client/html-parser/instructions/collapse";
import { ContainerInstruction } from "@/components/client/html-parser/instructions/container";
import { ContactInstruction } from "@/components/client/html-parser/instructions/contact";
import { DividerInstruction } from "@/components/client/html-parser/instructions/divider";
import { FigureInstruction } from "@/components/client/html-parser/instructions/figure";
import { FontAwesomeInstruction } from "@/components/client/html-parser/instructions/font-awesome";
import { HeadingInstruction } from "@/components/client/html-parser/instructions/heading";
import { ImageInstruction } from "@/components/client/html-parser/instructions/image";
import { InputInstruction } from "@/components/client/html-parser/instructions/input";
import { LinkInstruction } from "@/components/client/html-parser/instructions/link";
import { ListInstruction } from "@/components/client/html-parser/instructions/list";
import { ListItemInstruction } from "@/components/client/html-parser/instructions/list-item";
import { ParagraphInstruction } from "@/components/client/html-parser/instructions/paragraph";
import { RemoveEmInstruction } from "@/components/client/html-parser/instructions/remove-em";
import { RowInstruction } from "@/components/client/html-parser/instructions/row";
import { ScriptInstruction } from "@/components/client/html-parser/instructions/script";
import { TableInstruction } from "@/components/client/html-parser/instructions/table";
import { TbodyInstruction } from "@/components/client/html-parser/instructions/tbody";
import { TdInstruction } from "@/components/client/html-parser/instructions/td";
import { ThInstruction } from "@/components/client/html-parser/instructions/th";
import { TheadInstruction } from "@/components/client/html-parser/instructions/thead";
import { TrInstruction } from "@/components/client/html-parser/instructions/tr";

export type HTMLParserInstruction = {
  shouldProcessNode: (
    node: Element,
    props: ReturnType<typeof attributesToProps>,
    children: ReturnType<typeof domToReact>,
    index: number
  ) => boolean;
  processNode: (
    node: Element,
    props: ReturnType<typeof attributesToProps>,
    children: ReturnType<typeof domToReact>,
    index: number,
    childParser: (children: DOMNode[]) => ReturnType<typeof domToReact>
  ) => React.JSX.Element;
};

const selfClosingTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function isElement(domNode: DOMNode): domNode is Element {
  const isTag = ["tag", "script"].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
}

export function extractTextFromDOMNode(node: DOMNode): string {
  if (node.type === "text") {
    return node.data || "";
  }

  if (isElement(node) && node.children) {
    return node.children
      .map((child: any) => extractTextFromDOMNode(child))
      .join("")
      .trim();
  }

  return "";
}

// Helper function to check if a DOM node has an ancestor with a specific class
export function hasAncestorWithClass(node: Element, className: string): boolean {
  let current = node.parent;
  while (current) {
    // Check if current is a DOMNode before passing to isElement
    if (current && typeof current === "object" && "type" in current && isElement(current as DOMNode)) {
      const element = current as Element;
      const currentClassName = (element.attribs?.class as string) ?? "";
      if (currentClassName.includes(className)) {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

export function unwrapTags(children: ReactNode): ReactNode {
  return React.Children.map(children, (child) => {
    if (child && isValidElement(child)) {
      const element = child as ReactElement<any>;
      if (element.type === "span" || element.type === "strong") {
        return unwrapTags(element.props.children);
      }
    }
    return child;
  });
}

const defaultInstructions: HTMLParserInstruction[] = [
  CollapseInstruction,
  ContactInstruction,
  AuthorInstruction,
  LinkInstruction,
  FontAwesomeInstruction,
  RemoveEmInstruction,
  HeadingInstruction,
  ParagraphInstruction,
  ListInstruction,
  ListItemInstruction,
  DividerInstruction,
  FigureInstruction,
  ImageInstruction,
  BlockquoteInstruction,
  InputInstruction,
  ContainerInstruction,
  RowInstruction,
  TableInstruction,
  TheadInstruction,
  TbodyInstruction,
  TrInstruction,
  ThInstruction,
  TdInstruction,
  ScriptInstruction,
];

// Helper function to normalize whitespace between elements
function normalizeWhitespace(html: string): string {
  return (
    html
      // Preserve single spaces between inline elements and text
      .replace(/>\s+</g, (match) => {
        // If there's whitespace between tags, preserve a single space
        return match.includes(" ") ? "> <" : "><";
      })
      // Remove excessive whitespace at the beginning and end of lines
      .replace(/^\s+|\s+$/gm, "")
      // Normalize multiple consecutive spaces to single space
      .replace(/[ \t]+/g, " ")
      // Remove empty lines
      .replace(/\n\s*\n/g, "\n")
  );
}

export function HtmlParser({ html, instructions = [] }: { html: string; instructions?: HTMLParserInstruction[] }) {
  const normalizedHtml = useMemo(() => normalizeWhitespace(html), [html]);

  const options: HTMLReactParserOptions = useMemo(() => {
    return {
      replace: (node, index) => {
        // Handle text nodes to preserve necessary spacing
        if (node.type === "text") {
          const text = (node as any).data;
          if (text && typeof text === "string") {
            // Preserve single spaces but trim excessive whitespace
            const trimmedText = text.replace(/\s+/g, " ");
            // Don't render empty text nodes
            if (trimmedText.trim() === "") {
              return trimmedText.includes(" ") ? <> </> : <></>;
            }
            return <>{trimmedText}</>;
          }
        }

        if (!isElement(node)) {
          return;
        }

        const props = attributesToProps(node.attribs);

        // Remove bad props
        // Only strip inline styles unless the node is a div or iframe
        if (node.tagName !== "div" && node.tagName !== "iframe") {
          delete props.style;
        }
        delete props.key;
        delete props.dangerouslySetInnerHTML;
        delete props.children;

        // Preserve rowspan and colspan for table cells
        const isTableCell = node.tagName === "td" || node.tagName === "th";
        const preservedAttribs: { rowspan?: string | number; colspan?: string | number } = {};
        if (isTableCell) {
          if (node.attribs.rowspan) preservedAttribs.rowspan = node.attribs.rowspan;
          if (node.attribs.colspan) preservedAttribs.colspan = node.attribs.colspan;
        }

        const children = domToReact(node.children as DOMNode[], options);

        for (const instruction of [...instructions, ...defaultInstructions]) {
          if (instruction.shouldProcessNode(node, props, children, index)) {
            return instruction.processNode(node, props, children, index, (children) =>
              domToReact(children as DOMNode[], options)
            );
          }
        }

        // Fallback renderer for nodes that are self-closing and as a result cannot have children passed to them
        if (selfClosingTags.has(node.tagName)) {
          return <node.name {...props} key={nanoid()} />;
        }

        // Fallback renderer for nodes that can have children passed to them
        return (
          // @ts-ignore
          <node.name {...props} key={nanoid()}>
            {children}
          </node.name>
        );
      },
      trim: false,
    };
  }, [instructions]);

  const content = useMemo(() => parse(normalizedHtml, options), [normalizedHtml, options]);

  return <div className="contents group/html-parser">{content}</div>;
}

