import { Card } from "@/components/card";

import { Link } from "@/components/link";
import Image from "next/image";
import coe from "@/img/ovc/coe_logo.png";
import aaha from "@/img/ovc/aaha_logo.png";
import petTrustImage from "@/img/ovc/OVCpettrust.jpg";
import theCrestImage from "@/img/ovc/DSC00139.jpg"

export const OVCCards = () => {
  const ovcCards = [
    {
      title: "Best Friends",
      footer: "The Pet Magazine of the Ontario Veterinary College",
      url: "https://pettrust.uoguelph.ca/best-friends",
      image: {
        src: petTrustImage.src,
        width: petTrustImage.width,
        height: petTrustImage.height,
        blurred: petTrustImage.blurDataURL,
        alt: "Best Friends Magazine",
      },
    },
    {
      title: "The Crest",
      footer: "The Research, Teaching, and Health Care Magazine of the Ontario Veterinary College",
      url: "/ovc/theCrestImage",
      image: {
        src: theCrestImage.src,
        width: theCrestImage.width,
        height: theCrestImage.height,
        blurred: theCrestImage.blurDataURL,
        alt: "The Crest Magazine of OVC",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {ovcCards.map((ovcCard, index) => (
        <Card
          key={ovcCard.title}
          className="h-full"
          title={<span className="my-auto w-full text-center text-[2.2rem] font-bold">{ovcCard.title}</span>}
          footer={<span className="my-auto w-full text-center text-[2.2rem]">{ovcCard.footer}</span>}
          href={ovcCard.url}
          centered
          image={{
            ...ovcCard.image,
            className: "aspect-[3/2] w-full",
            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
          }}
        />
      ))}
      <div className="flex flex-col gap-2 bg-uog-color-grey-light px-5 py-6 transition-colors items-center">
        <div className="text-2xl">
          <i className="fa-solid fa-2xl fa-certificate text-uog-color-red">&nbsp;</i>
          Accreditations
        </div>
        <div className="text-base">
          <br />
          We are committed to the highest standards of education and animal care. OVC is <Link href="/ovc/accreditation/">accredited</Link> by the American Veterinary Medical Association (AVMA) and Canadian Veterinary Medical Association (CVMA) Council on Accreditation (COE), as well as the American Animal Hospital Association. 
        </div>
        <div className="grid grid-cols-2 gap-4 ">
        <div>
         <Link href="https://www.avma.org/">
          <Image
            src={coe.src}
            width={125}
            height={125}
            alt="COE Accredited Logo"
            placeholder={coe?.blurred ? "blur" : "empty"}
          /></Link>
          </div>
          <div>
            <Link href="https://www.aaha.org/">
                    <Image
            src={aaha.src}
            width={125}
            height={125}
            alt="AAHA Accredited Logo"
            placeholder={aaha?.blurred ? "blur" : "empty"}
          /></Link>
        </div>
        </div>
      </div>
    </div>
  );
};
