"use client";

import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, type DOMNode } from "html-react-parser";
import React, { useMemo } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import Script from "next/script";
import { Info } from "@uoguelph/react-components/info";
import { Button, type ButtonProps } from "@uoguelph/react-components/button";
import { Link } from "@uoguelph/react-components/link";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Divider } from "@uoguelph/react-components/divider";

type ParserInstruction = {
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
    index: number
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

function isElement(domNode: DOMNode): domNode is Element {
  const isTag = ["tag", "script"].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
}

const defaultInstructions: ParserInstruction[] = [
  // Author
  {
    shouldProcessNode: (node, props) => (props.className as string)?.includes("author"),
    processNode: (node, props, children) => {
      return (
        <>
          <div className="mt-4"></div>
          <Info>
            {React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type !== "br")}
          </Info>
        </>
      );
    },
  },
  // Links
  {
    shouldProcessNode: (node, props) => node.tagName === "a" && typeof props.href === "string",
    processNode: (node, props, children) => {
      if (props.href === "") {
        return <></>;
      }

      const href = props.href as string;

      // Check if the link is a button by looking for the "btn" class or "btn-*" class
      const className = (props.className as string) ?? "";
      const isButton = className.includes("btn");

      if (isButton) {
        const outlined = className.includes("btn-outline");
        let color: ButtonProps["color"];

        switch (className.match(/btn-(?:outline-)?(\w*)/)?.[1]) {
          case "primary":
            color = "red";
            break;
          case "secondary":
            color = "black";
            break;
          case "info":
            color = "blue";
            break;
          case "success":
            color = "green";
            break;
          case "warning":
            color = "yellow";
            break;
          case "danger":
            color = "red";
            break;
          case "light":
            color = "yellow";
            break;
          case "dark":
            color = "black";
            break;
        }

        return (
          <Button {...props} key={nanoid()} color={color ?? "red"} outlined={outlined} href={href} as="a">
            {children}
          </Button>
        );
      }

      return (
        <Link {...props} key={nanoid()} href={href}>
          {children}
        </Link>
      );
    },
  },
  // Headings
  {
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
    processNode: (node, props, children, index) => {
      const level = node.tagName as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const className = typeof props.className === "string" ? props.className : "";

      return (
        <Typography
          {...props}
          key={nanoid()}
          type={level}
          as={level}
          className={twMerge(index === 0 && "mt-0", className)}
        >
          {React.Children.map(children, (child) => {
            // Remove strong tags from headings
            if (typeof child !== "string" && child.type === "strong") {
              return child.props.children;
            }

            return child;
          })}
        </Typography>
      );
    },
  },
  // Paragraphs
  {
    shouldProcessNode: (node) => node.tagName === "p",
    processNode: (node, props, children, index) => {
      const className = typeof props.className === "string" ? props.className : "";

      return (
        <Typography {...props} key={nanoid()} type="body" as="p" className={twMerge(index === 0 && "mt-0", className)}>
          {children}
        </Typography>
      );
    },
  },
  // Lists
  {
    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
    processNode: (node, props, children, index) => {
      return (
        <List {...props} as={node.tagName as "ul" | "ol"}>
          {children}
        </List>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "li",
    processNode: (node, props, children, index) => {
      return <ListItem {...props}>{children}</ListItem>;
    },
  },
  // Divider
  {
    shouldProcessNode: (node) => node.tagName === "hr",
    processNode: (node) => <Divider />,
  },
  // Scripts
  {
    shouldProcessNode: (node) => node.tagName === "script",
    processNode: (node, props, children, index) => {
      return <Script src={props.src as string} type={props.type as string} strategy="lazyOnload" />;
    },
  },
];

export function HtmlParser({ html, instructions = [] }: { html: string; instructions?: ParserInstruction[] }) {
  const options: HTMLReactParserOptions = useMemo(() => {
    return {
      replace: (node, index) => {
        if (!isElement(node)) {
          return;
        }

        const props = attributesToProps(node.attribs);

        // Remove bad props
        delete props.style;
        delete props.key;
        delete props.dangerouslySetInnerHTML;
        delete props.children;

        const children = domToReact(node.children as DOMNode[], options);

        for (const instruction of [...instructions, ...defaultInstructions]) {
          if (instruction.shouldProcessNode(node, props, children, index)) {
            return instruction.processNode(node, props, children, index);
          }
        }

        // Fallback renderer for nodes that are self-closing and as a result cannot have children passed to them
        if (selfClosingTags.has(node.tagName)) {
          return <node.name {...props} />;
        }

        // Fallback renderer for nodes that can have children passed to them
        return (
          // @ts-ignore
          <node.name {...props}>{children}</node.name>
        );
      },
      trim: true,
    };
  }, [instructions]);

  const content = useMemo(() => parse(html, options), [html, options]);

  return <>{content}</>;
}
