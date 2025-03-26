import { Card } from "@/components/card";
import work from "@/img/ovc/heather-murphy-in_lab.jpg";
import collaborate from "@/img/ovc/collaborate.png";
import { Link } from "@/components/link";
import Image from "next/image";
import coe from "@/img/ovc/coe_logo.png";
import aaha from "@/img/ovc/aaha_logo.png";

export const OVCCards = () => {
  const ovcCards = [
    {
      title: "People are our power - Work",
      url: "/ovc/work",
      image: {
        src: work.src,
        width: work.width,
        height: work.height,
        blurred: work.blurDataURL,
        alt: "work for OVC",
      },
    },
    {
      title: "Help impove life - Collaborate",
      url: "/ovc/collaborate",
      image: {
        src: collaborate.src,
        width: collaborate.width,
        height: collaborate.height,
        blurred: collaborate.blurDataURL,
        alt: "Collaborate with OVC",
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
          OVC is an <Link href="/ovc/accreditation/">accredited institution</Link>, and faculty
          members are affiliated with a number of other centres and institutes.
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
