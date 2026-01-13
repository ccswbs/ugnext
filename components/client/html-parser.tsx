"use client";

import parse, { attributesToProps, type DOMNode, domToReact, Element, HTMLReactParserOptions } from "html-react-parser";
import React, { Fragment, isValidElement, ReactElement, ReactNode, useMemo } from "react";
import { nanoid } from "nanoid";
import { Typography } from "@uoguelph/react-components/typography";
import { twMerge } from "tailwind-merge";
import Script from "next/script";
import { Input } from "@headlessui/react";
import { Info } from "@uoguelph/react-components/info";
import { Button, type ButtonProps } from "@uoguelph/react-components/button";
import { Link } from "@uoguelph/react-components/link";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Divider } from "@uoguelph/react-components/divider";
import { Grid } from "@uoguelph/react-components/grid";
import Image from "next/image";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import NextLink from "next/link";
import { collapseSlashes } from "@/lib/string-utils";
import { clamp } from "@uoguelph/react-components";
import { Blockquote, BlockquoteContent } from "@uoguelph/react-components/blockquote";
import { ElementType } from "domelementtype";

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

function isElement(domNode: DOMNode): domNode is Element {
  const isTag = ["tag", "script"].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
}

// Helper function to check if a DOM node has an ancestor with a specific class
function hasAncestorWithClass(node: Element, className: string): boolean {
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

function unwrapTags(children: ReactNode): ReactNode {
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

// Counter for td elements with rowspan to handle alternating colors
let rowspanTdCounter = 0;

const defaultInstructions: ParserInstruction[] = [
  {
    shouldProcessNode: (node, props) => (props.className as string)?.includes("collapse"),
    processNode: (node, props, children) => {
      return <>{children}</>;
    },
  },
  // vcard
  {
    shouldProcessNode: (node, props) => {
      const className = (props.className as string) ?? "";
      return className.includes("vcard");
    },
    processNode: (node, props, children, index, childParser) => {
      // Helper function to recursively extract information from DOM nodes
      const extractVcardInfo = (
        domNode: Element
      ): {
        name: string;
        title: string;
        phone: string;
        extension: string;
        email: string;
      } => {
        let name = "",
          title = "",
          phone = "",
          extension = "",
          email = "";

        const processNode = (node: any) => {
          if (isElement(node)) {
            const className = (node.attribs?.class as string) ?? "";

            // Extract name from .fn class or strong tags
            if (className.includes("fn") || node.tagName === "strong") {
              const nameText = extractTextFromDOMNode(node);
              if (nameText && !name) {
                name = nameText;
              }
            }

            // Extract title from .org class
            if (className.includes("org")) {
              const titleText = extractTextFromDOMNode(node);
              if (titleText && !title) {
                title = titleText;
              }
            }

            // Extract links (phone and email)
            if (node.tagName === "a" && typeof node.attribs?.href === "string") {
              const href = node.attribs.href;

              if (href.startsWith("tel:")) {
                const tokens = href.replace("tel:", "").split("p");
                phone = extractTextFromDOMNode(node);
                extension = tokens[1] || "";
              } else if (href.startsWith("mailto:")) {
                email = href.replace("mailto:", "");
              }
            }

            // Recursively process children
            if (node.children) {
              node.children.forEach((child: any) => processNode(child));
            }
          } else if (
            node?.type === "text" &&
            node.data &&
            node.data.trim().length > 2 &&
            !title &&
            !node.data.includes("@")
          ) {
            // Extract title from direct text content (but not email addresses)
            const trimmedText = node.data.trim();
            if (trimmedText && !name.includes(trimmedText)) {
              title = trimmedText;
            }
          }
        };

        // Process all children of the vcard node
        if (domNode.children) {
          domNode.children.forEach((child: any) => processNode(child));
        }

        return { name, title, phone, extension, email };
      };

      // Helper function to extract text content from any DOM node, ignoring HTML structure
      const extractTextFromDOMNode = (node: any): string => {
        if (node?.type === "text") {
          return node.data || "";
        }

        if (isElement(node) && node.children) {
          return node.children
            .map((child: any) => extractTextFromDOMNode(child))
            .join("")
            .trim();
        }

        return "";
      };

      const { name, title, phone, extension, email } = extractVcardInfo(node);

      return (
        <Contact {...props} key={nanoid()}>
          <ContactName key="name">{name}</ContactName>
          <ContactTitle key="title">{title}</ContactTitle>
          <ContactPhone key="phone" number={phone} extension={extension}></ContactPhone>
          <ContactEmail key="email" email={email} />
        </Contact>
      );
    },
  },
  // Author
  {
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
  },
  // Links
  {
    shouldProcessNode: (node, props) => {
      // Skip links that are inside vcard elements - let vcard processor handle them
      if (hasAncestorWithClass(node, "vcard")) {
        return false;
      }
      return node.tagName === "a" && typeof props.href === "string";
    },
    processNode: (node, props, children) => {
      if (props.href === "") {
        return <></>;
      }

      let href = props.href as string;

      if (href.startsWith("/sites/default/files")) {
        const base = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev";
        href = collapseSlashes(`${base}/${href}`);
      }

      // Check if the link is a button by looking for the "btn" class or "btn-*" class
      const className = (props.className as string) ?? "";
      const isButton = className.includes("btn");

      if (isButton) {
        const outlined = className.includes("btn-outline");
        let color: ButtonProps["color"];

        // Exclude certain classes
        let excludedClasses = ["text-dark-social"];
        let updatedClassname = className;
        excludedClasses.forEach((element) => {
          updatedClassname = updatedClassname.replace(element, "");
        });

        // Exclude certain classes
        const classes = twMerge("mr-3 mb-3", updatedClassname);

        switch (className.match(/btn-(?:outline-)?(\w*)/)?.[1]) {
          case "primary":
            color = "primary";
            break;
          case "secondary":
            color = "secondary";
            break;
          case "info":
            color = "secondary";
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
            color = "white";
            break;
          case "dark":
            color = "black";
            break;
        }

        return (
          <Button
            {...props}
            key={nanoid()}
            className={classes}
            color={color ?? "red"}
            outlined={outlined}
            href={href}
            as={NextLink}
          >
            {children}
          </Button>
        );
      }

      // Ensure link color is preserved even when content is bold
      const linkClassName = twMerge(
        "!text-body-copy-link hover:!text-body-copy-link-hover dark:!text-body-copy-link-on-dark dark:hover:!text-body-copy-link-hover-on-dark light:!text-body-copy-link-on-light light:hover:!text-body-copy-link-hover-on-light [&_*]:!text-body-copy-link [&_*:hover]:!text-body-copy-link-hover [&_*]:dark:!text-body-copy-link-on-dark [&_*]:light:!text-body-copy-link-on-light",
        className
      );

      return (
        <Link {...props} key={nanoid()} href={href} as={NextLink} className={linkClassName}>
          {children}
        </Link>
      );
    },
  },
  // Font Awesome Icons
  {
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
  },
  // Remove <em> around <i>
  {
    shouldProcessNode: (node, props, children) => {
      if (node.tagName !== "em") {
        return false;
      }

      return React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === "i");
    },
    processNode: (node, props, children, index) => {
      return <Fragment key={nanoid()}>{children}</Fragment>;
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
      const headingClass = className.match(/\bh\d\b/g);
      const displayClass = /\bdisplay-(\d)\b/g.exec(className);
      const cleanedChildren = unwrapTags(children);
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
          className={twMerge("group-first/html-parser:first:mt-0", className)}
        >
          {cleanedChildren}
        </Typography>
      );
    },
  },
  // Paragraphs
  {
    shouldProcessNode: (node) => node.tagName === "p",
    processNode: (node, props, children, index) => {
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
  },
  // Lists
  {
    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
    processNode: (node, props, children, index) => {
      return (
        <List
          {...props}
          key={nanoid()}
          as={node.tagName as "ul" | "ol"}
          className={"group-first/html-parser:first:pt-0 list-outside pl-4 pt-3 text-lg"}
        >
          {children}
        </List>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "li",
    processNode: (node, props, children, index) => {
      return (
        <ListItem {...props} key={nanoid()}>
          {children}
        </ListItem>
      );
    },
  },
  // Divider
  {
    shouldProcessNode: (node) => node.tagName === "hr",
    processNode: (node) => <Divider key={nanoid()} />,
  },
  // Figure
  {
    shouldProcessNode: (node) => node.tagName === "figure",
    processNode: (node, props, children) => {
      const className = typeof props.className === "string" ? props.className : "";
      const classes = twMerge(
        "my-4",
        (className.includes("align-left") || props["data-align"] === "left") && "float-left mr-4 ml-0",
        (className.includes("align-right") || props["data-align"] === "right") && "float-right ml-4 mr-0",
        props.className as string
      );

      return (
        <figure {...props} key={nanoid()} className={classes}>
          {children}
        </figure>
      );
    },
  },
  // Images
  {
    shouldProcessNode: (node) => node.tagName === "img",
    processNode: (node, props) => {
      const className = typeof props.className === "string" ? props.className : "";
      const classes = twMerge(
        "my-4",
        (className.includes("align-left") || props["data-align"] === "left") && "float-left mr-4 ml-0",
        (className.includes("align-right") || props["data-align"] === "right") && "float-right ml-4 mr-0",
        props.className as string
      );

      let src = props.src as string;

      if (src.startsWith("/sites/default/files")) {
        src = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${props.src}`;
      } else if (src.startsWith("/.netlify/images?url=")) {
        src = src.replace("/.netlify/images?url=", "");
      }

      const ImageComponent = props.width && props.height ? Image : "img";

      return (
        <figure className="my-4" key={nanoid()}>
          <ImageComponent {...props} src={src} loading="lazy" alt={(props.alt as string) ?? ""} className={classes} />

          {props["data-caption"] && (
            <figcaption className="text-sm text-body-copy-on-light mt-2">{props["data-caption"]}</figcaption>
          )}
        </figure>
      );
    },
  },
  // Blockquote
  {
    shouldProcessNode: (node, props) => node.tagName === "blockquote",
    processNode: (node, props, children, index, childParser) => {
      return (
        <Blockquote>
          <BlockquoteContent className="[&_*]:text-2xl mt-4 [&_*]:inline [&_i]:hidden!">{children}</BlockquoteContent>
        </Blockquote>
      );
    },
  },
  // Input
  {
    shouldProcessNode: (node, props) => node.tagName === "input",
    processNode: (node, props) => {
      let inputWrapperClasses =
        "uofg-text-input-wrapper text-input flex rounded-md border border-grey-light bg-white px-4 py-2 transition-colors focus-within:border-blue focus:outline-none";
      if (props.type === "submit") {
        return <Button {...props} key={nanoid()} color={"red"} as={Input} />;
      }

      // @todo - consider using TextInput in future(currently gives warning due to div being in a paragraph)
      return (
        <span className={twMerge(inputWrapperClasses, "mb-4")}>
          <Input key={nanoid()} className={"uofg-text-input flex-1 bg-white focus:outline-none"} {...props} />
        </span>
      );
    },
  },
  // Containers
  {
    shouldProcessNode: (node, props) => (props.className as string)?.includes("container"),
    processNode: (node, props, children) => {
      return <>{children}</>;
    },
  },
  // Rows and Columns
  {
    shouldProcessNode: (node, props) => /\brow\b/.test(props.className as string),
    processNode: (node, props, children, index) => {
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
  },
  // Tables
  {
    shouldProcessNode: (node) => node.tagName === "table",
    processNode: (node, props, children) => {
      // Reset the rowspan counter for each new table
      rowspanTdCounter = 0;

      // Strip all existing attributes and create clean props for table
      const cleanProps = {};
      const classes = twMerge("w-full border-collapse border border-grey-light my-4");

      return (
        <div className="overflow-x-auto my-4">
          <table {...cleanProps} key={nanoid()} className={classes}>
            {children}
          </table>
        </div>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "thead",
    processNode: (node, props, children) => {
      // Strip all existing attributes and create clean props for thead
      const cleanProps = {};

      return (
        <thead {...cleanProps} key={nanoid()}>
          {children}
        </thead>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "tbody",
    processNode: (node, props, children) => {
      // Strip all existing attributes and create clean props for tbody
      const cleanProps = {};

      return (
        <tbody {...cleanProps} key={nanoid()}>
          {children}
        </tbody>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "tr",
    processNode: (node, props, children, index) => {
      // Strip all existing attributes and create clean props for tr
      const cleanProps = {};

      const classes = twMerge("border border-grey-light");

      return (
        <tr {...cleanProps} key={nanoid()} className={classes}>
          {children}
        </tr>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "th",
    processNode: (node, props, children, index, childParser) => {
      // Get preserved attributes from the original node
      const cleanProps: { rowspan?: string | number; colspan?: string | number } = {};
      if (node.attribs.rowspan) cleanProps.rowspan = node.attribs.rowspan;
      if (node.attribs.colspan) cleanProps.colspan = node.attribs.colspan;

      const classes = twMerge("border border-grey-light px-4 py-2 text-left font-semibold");

      return (
        <th {...cleanProps} key={nanoid()} className={classes}>
          {children}
        </th>
      );
    },
  },
  {
    shouldProcessNode: (node) => node.tagName === "td",
    processNode: (node, props, children, index, childParser) => {
      // Get preserved attributes from the original node
      const cleanProps: { rowspan?: string | number; colspan?: string | number } = {};
      if (node.attribs.rowspan) cleanProps.rowspan = node.attribs.rowspan;
      if (node.attribs.colspan) cleanProps.colspan = node.attribs.colspan;

      let backgroundClass = "";

      // Handle alternating colors for td elements with rowspan
      if (node.attribs.rowspan) {
        // Use independent counter for rowspan cells
        const isEvenRowspanCell = rowspanTdCounter % 2 === 0;
        backgroundClass = isEvenRowspanCell ? "bg-grey-light-bg" : "bg-white";
        rowspanTdCounter++;
      } else {
        // For regular td elements, find the parent tr and use its index
        let parentTr = node.parent;
        while (parentTr && parentTr.type === "tag" && parentTr.name !== "tr") {
          parentTr = parentTr.parent;
        }

        let rowIndex = 0;
        if (parentTr && parentTr.parent) {
          const siblings = parentTr.parent.children.filter((child: any) => child.type === "tag" && child.name === "tr");
          rowIndex = siblings.indexOf(parentTr);
        }

        const isEvenRow = rowIndex % 2 === 0;
        backgroundClass = isEvenRow ? "bg-grey-light-bg" : "bg-white";
      }

      const classes = twMerge("border border-grey-light px-4 py-2", backgroundClass);

      return (
        <td {...cleanProps} key={nanoid()} className={classes}>
          {children}
        </td>
      );
    },
  },
  // Scripts
  {
    shouldProcessNode: (node) => node.tagName === "script",
    processNode: (node, props, children, index) => {
      return <Script key={nanoid()} src={props.src as string} type={props.type as string} strategy="lazyOnload" />;
    },
  },
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

export function HtmlParser({ html, instructions = [] }: { html: string; instructions?: ParserInstruction[] }) {
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
