import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const ImageInstruction: HTMLParserInstruction = {
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
};
