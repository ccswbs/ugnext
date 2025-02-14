import { Heading } from "@/components/heading";
import { Divider } from "@/components/divider";

export const TagLine = () => (
  <>
    <div className="flex flex-col items-center justify-center py-4">
      <Heading level={1} className="mb-4 text-center font-condensed text-4xl text-black" as="span">
        Ontario Veterinary College
      </Heading>
      <span className="text-center text-2xl font-thin">A world leader in advancing veterinary science, learning and research to improve the lives of animals, people and our planet.</span>
      <br />
     </div>

    <Divider />

    <div className="flex flex-col items-center justify-center py-4">
      {/* <Heading level={2} className="mb-4 text-center font-condensed text-4xl text-black" as="span">
        Improve Life Improve Life With Us
      </Heading> */}
      {/* <span className="text-center text-2xl">At the Ontario Veterinary College, we are educating the next generation of health leaders, fueling discovery and providing our expertise to improve health and well-being across our world. Discover how you can contribute to the ever-evolving world of medicine, care, scientific discovery, and community.</span> */}
    </div>
  </>
);
