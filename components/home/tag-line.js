import { Heading } from "@/components/heading";
import { Divider } from "@/components/divider";

export const TagLine = () => (
  <>
    <div className="flex flex-col items-center justify-center py-4">
      <Heading level={1} className="mb-4 text-center font-condensed text-4xl text-black" as="span">
        University of Guelph, Ontario, Canada
      </Heading>

      <span className="text-center text-2xl font-thin">Improve Life</span>
    </div>

    <Divider />
  </>
);
