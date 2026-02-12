import { nanoid } from "nanoid";
import { Button, type ButtonProps } from "@uoguelph/react-components/button";
import { Link } from "@uoguelph/react-components/link";
import NextLink from "next/link";
import { twMerge } from "tailwind-merge";
import { collapseSlashes } from "@/lib/string-utils";
import { hasAncestorWithClass, HTMLParserInstruction } from "@/components/client/html-parser";

export const LinkInstruction: HTMLParserInstruction = {
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
      "!text-body-copy-link hover:!text-body-copy-link-hover dark:!text-body-copy-link-on-dark dark:hover:!text-body-copy-link-hover-on-dark light:!text-body-copy-link-on-light light:hover:!text-body-copy-link-on-light [&_*]:!text-body-copy-link [&_*:hover]:!text-body-copy-link-hover [&_*]:dark:!text-body-copy-link-on-dark [&_*]:light:!text-body-copy-link-on-light",
      className
    );

    return (
      <Link {...props} key={nanoid()} href={href} as={NextLink} className={linkClassName}>
        {children}
      </Link>
    );
  },
};
