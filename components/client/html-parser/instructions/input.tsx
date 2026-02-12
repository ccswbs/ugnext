import { nanoid } from "nanoid";
import { Input } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Button } from "@uoguelph/react-components/button";
import { HTMLParserInstruction } from "@/components/client/html-parser";

export const InputInstruction: HTMLParserInstruction = {
  shouldProcessNode: (node) => node.tagName === "input",
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
};
