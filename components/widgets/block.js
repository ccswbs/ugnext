import { HtmlParser } from "@/components/html-parser";
import { Heading } from "@/components/heading";
import { getHeadingLevel } from "@/lib/string-utils";

export const Block = ({ data }) => {

  console.log(data);

  return (
    <>
      <div>BLOCK: {JSON.stringify(data)}</div>
    </>
  );
};
