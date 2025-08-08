import { Card, CardImage, CardContent, CardTitle, CardFooter } from "@uoguelph/react-components/card";
import { Link } from "@uoguelph/react-components/link";
import Image from "next/image";
import coe from "@/img/ovc/coe_logo.png";
import aaha from "@/img/ovc/aaha_logo.png";
import petTrustImage from "@/img/ovc/best_friends_cover.jpg";
import theCrestImage from "@/img/ovc/the_crest_cover.jpg";

export const OVCCards = () => {
  const ovcCards = [
    {
      title: "Best Friends",
      footer: "The Pet Magazine of the Ontario Veterinary College, Published by OVC Pet Trust",
      url: "https://pettrust.uoguelph.ca/best-friends",
      image: {
        src: petTrustImage.src,
        width: petTrustImage.width,
        height: petTrustImage.height,
        blurred: petTrustImage.blurDataURL,
        alt: "Best Friends Magazine - Cover Image",
      },
    },
    {
      title: "The Crest",
      footer: "The Research, Teaching, and Health Care Magazine of the Ontario Veterinary College",
      url: "/ovc/crest",
      image: {
        src: theCrestImage.src,
        width: theCrestImage.width,
        height: theCrestImage.height,
        blurred: theCrestImage.blurDataURL,
        alt: "The Crest Magazine of OVC - Cover Image",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4  md:grid-cols-3">
      {ovcCards.map((ovcCard, index) => (
        <Card key={ovcCard.title} as="a" className="h-full" href={ovcCard.url}>
          <CardImage
            src={ovcCard.image.src}
            alt={ovcCard.image.alt}
            height={ovcCard.image.height}
            width={ovcCard.image.width}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full"
          />
          <CardContent>
            <CardTitle className="my-auto w-full text-center text-[2.2rem] font-bold">{ovcCard.title}</CardTitle>
          </CardContent>
          <CardFooter>
            <span className="my-auto w-full text-center text-[2.2rem]">{ovcCard.footer}</span>
          </CardFooter>
        </Card>
      ))}
      <div className="flex flex-col gap-2 bg-uog-color-grey-light-bg px-5 py-6 transition-colors items-center">
        <div className="text-2xl mt-5">
          <i className="fa-solid fa-2xl fa-certificate text-uog-color-red">&nbsp;</i>
          Accreditations
        </div>
        <div className="text-base mt-8">
          We are committed to the highest standards of education and animal care. OVC is{" "}
          <Link href="/ovc/accreditation/">accredited</Link> by the{" "}
          <Link href="https://www.avma.org/">American Veterinary Medical Association (AVMA)</Link> and{" "}
          <Link href="https://www.canadianveterinarians.net/">Canadian Veterinary Medical Association (CVMA)</Link>{" "}
          Council on Accreditation (COE), as well as the{" "}
          <Link href="https://www.aaha.org/">American Animal Hospital Association</Link> .
        </div>
        <div className="p-10">
          <div>
            <Image
              src={coe.src}
              width="125"
              height="125"
              alt="COE Accredited Logo"
              placeholder={coe?.blurred ? "blur" : "empty"}
            />
          </div>
          <div className="mt-10">
            <Image
              src={aaha.src}
              width="125"
              height="125"
              alt="AAHA Accredited Logo"
              placeholder={aaha?.blurred ? "blur" : "empty"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
