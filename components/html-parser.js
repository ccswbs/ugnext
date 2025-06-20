import React, { Fragment, useMemo } from "react";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { Link } from "@/components/link";
import { Heading } from "@/components/heading";
import { List, ListItem } from "@/components/list";
import { Divider } from "@/components/divider";
import { getHeadingLevel } from "@/lib/string-utils";
import { Button } from "@/components/button";
import Image from "next/image";
import Script from "next/script";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";

const getImageUrl = (src) => {
  if (src.startsWith("/sites/default/files")) {
    return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${src}`;
  }
  return src;
};

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const withKeys = (children) =>
  React.Children.map(children, (child, index) =>
    React.isValidElement(child) ? React.cloneElement(child, { key: index }) : child
  );

const parser = new Parser();
export const DEFAULT_PROCESSOR = new ProcessNodeDefinitions().processDefaultNode;
export const DEFAULT_INSTRUCTIONS = [
  // Headings
  {
    shouldProcessNode: (node) => headingTags.has(node.tagName),
    processNode: (node, children, index) => {
      const level = getHeadingLevel(node.tagName);
      node.attribs.className = node.attribs.class;
      delete node.attribs.class;
      delete node?.attribs?.style;

      // Remove <strong> tags inside heading tags
      const remStrongChildren = children.map(child => {
        if (child && child.type === 'strong' && child.props && child.props.children) {
          // Unwrap <strong> by returning its children
          return child.props.children;
        }
        return child;
      });

      return (
        <Heading {...node.attribs} level={level} key={index}>
          {withKeys(remStrongChildren)}
        </Heading>
      );
    },
  },
  // Remove <em> around <i>
  {
    shouldProcessNode: (node) =>
      node.name === "em" &&
      node.children?.length === 1 &&
      node.children[0].name === "i" &&
      node.children[0].attribs?.class?.includes("fa-"),
    processNode: (node, children, index) => {
      return React.cloneElement(children[0], { key: index });
    },
  },
  // Links and Buttons
  {
    shouldProcessNode: (node) => node.tagName === "a" && typeof node.attribs?.href === "string",
    processNode: (node, children, index) => {
      node.attribs.className = node.attribs.class;
      delete node.attribs.class;
      delete node?.attribs?.style;

      const isButton = node.attribs.className?.includes("btn");
      const type = node.attribs.className?.match(/btn-(?:outline-)?(\w*)/)?.[1];
      const map = {
        primary: "red",
        secondary: "black",
        info: "blue",
        success: "green",
        warning: "yellow",
        danger: "red",
        light: "gray",
        dark: "black",
      };
      const outlined = node.attribs.className?.includes("btn-outline");

      return isButton ? (
        <Button
          {...node.attribs}
          href={node.attribs?.href ?? ""}
          color={map[type] ?? "red"}
          outlined={outlined}
          key={index}
        >
          {withKeys(children)}
        </Button>
      ) : (
        <Link {...node.attribs} href={node.attribs?.href ?? ""} key={index}>
          {withKeys(children)}
        </Link>
      );
    },
  },
  // Lists
  {
    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
    processNode: (node, children, index) => {
      node.attribs.className = node.attribs.class;
      delete node.attribs.class;
      delete node?.attribs?.style;

      return (
        <List {...node.attribs} variant={node.tagName === "ol" ? "ordered" : "unordered"} key={index}>
          {children
            .filter((child) => child.type === "li")
            .map((child, i) => (
              <ListItem key={i}>{child.props.children}</ListItem>
            ))}
        </List>
      );
    },
  },
  // Divider
  {
    shouldProcessNode: (node) => node.tagName === "hr",
    processNode: (node, _, index) => <Divider key={index} />,
  },
  // Images
  {
    shouldProcessNode: (node) =>
      node.tagName === "img" && node.attribs.src && node.attribs.width && node.attribs.height,
    processNode: (node, _, index) => {
  
      // Convert Bootstrap alignment classes to Tailwind equivalents
      let imageClass = node.attribs.class || "";
      imageClass = imageClass
        .replace("align-left", "float-left mr-4") // Convert `align-left` to `float-left` with margin
        .replace("align-right", "float-right ml-4"); // Convert `align-right` to `float-right` with margin
        // Handle `data-align` attributes

        // Remove the `class` attribute and any inline styles
      delete node?.attribs?.class;

      // Check for caption (data-caption or figcaption)
      const caption = node.attribs["data-caption"] ? (
        <figcaption className="text-sm text-gray-600 mt-2">{node.attribs["data-caption"]}</figcaption>
      ) : null;
      
      // Prepend the base URL to relative paths to prevent broken image links on Netlify
      const src = getImageUrl(node.attribs.src);

      // If caption exists, wrap in <figure>, otherwise return just the <Image>
      if (caption) {
        return (
          <figure className="my-4">
            <Image
              src={src}
              alt={node.attribs.alt ?? null}
              loading="lazy"
              className={imageClass} // Use the updated className
              width={node.attribs.width}
              height={node.attribs.height}
            />
            {caption}
          </figure>
        );
      }
      // Return just the <Image> if no caption exists
      return (
        <Image
          key={index}
          src={src}
          alt={node.attribs.alt ?? null}
          loading="lazy"
          className={imageClass} // Use the updated className
          width={node.attribs.width}
          height={node.attribs.height}
        />
      );
    },
  },
  // Figure
  {
    shouldProcessNode: (node) => node.tagName === "figure",
    processNode: (node, children) => {
      // Extract alignment classes from the `class` attribute or `data-align`
      let figureClass = "my-4"; // Default margin for figures
      if (node.attribs?.class?.includes("align-left") || node.attribs["data-align"] === "left") {
        figureClass = "float-left mr-4";
      } else if (node.attribs?.class?.includes("align-right") || node.attribs["data-align"] === "right") {
        figureClass = "float-right ml-4";
      }

      // Remove inline styles
      delete node?.attribs?.style;

      // Return the <figure> element with processed children
      return <figure className={figureClass}>{children}</figure>;
    },
  },
  // Scripts
  {
    shouldProcessNode: (node) => node.tagName === "script",
    processNode: (node, _, index) => (
      <Script key={index} src={node.attribs.src} type={node.attribs.type} strategy="lazyOnload" />
    ),
  },
  // Fallback
  {
    shouldProcessNode: () => true,
    processNode: (node, children, index) => {
      delete node?.attribs?.style;
      const element = DEFAULT_PROCESSOR(node, children);
      return React.isValidElement(element) ? React.cloneElement(element, { key: index }) : element;
    },
  },
];

/**
 * Parses an HTML string into React nodes.
 */
export const HtmlParser = ({ html, instructions }) => {
  const parsed = useMemo(() => {
    const parsed = parser.parseWithInstructions(
      html,
      () => true,
      Array.isArray(instructions)
        ? [
            ...instructions,
            {
              shouldProcessNode: () => true,
              processNode: DEFAULT_PROCESSOR,
            },
          ]
        : DEFAULT_INSTRUCTIONS
    );

    if (Array.isArray(parsed)) {
      return parsed.map((child) => {
        if (typeof child === "object") {
          return <Fragment key={nanoid()}>{child}</Fragment>;
        }

        return child;
      });
    }

    return parsed;
  }, [html, instructions]);

  return <>{parsed}</>;
};

HtmlParser.propTypes = {
  html: PropTypes.string.isRequired,
  /**
   * Custom parsing instructions
   */
  instructions: PropTypes.arrayOf(
    PropTypes.shape({
      shouldProcessNode: PropTypes.func.isRequired,
      processNode: PropTypes.func.isRequired,
    })
  ),
};
