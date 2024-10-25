import Image from "next/image";

export const GraduateProgramHero = ({ hero }) => (
  <div className="relative flex w-full flex-col overflow-hidden">
    <Image
      className={"aspect-[16/9] max-h-[80vh] w-full object-cover md:aspect-[2.625]"}
      src={"https://placehold.co/1680x640/png"}
      alt={"Test image"}
      width={1680}
      height={640}
      sizes="100vw"
    />
  </div>
);
