
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Link } from "@/components/link";
import Image from "next/image";
import ovcCrest from "@/img/ovc/OVC-crest.png";

export const OVCFooter = () => {
    return (
<div className={"w-full py-5 bg-gray-100"}>
    <Container centered>
      {/* <div className={containerClasses}> */}
      <div className="grid items-center gap-4 sm:grid sm:grid-cols-[2fr_2fr] md:grid-cols-[2fr_5fr] ">
        <div className="place-items-center">
          <Image
            src={ovcCrest?.src}
            width={200}
            height={200}
            alt="Ontario Veterinary College - Crest"
            placeholder={ovcCrest?.blurred ? "blur" : "empty"}
            blurDataURL={ovcCrest?.blurred}
          />
        </div>
        <div className="text-lg ">
          The Ontario Veterinary College (OVC) at the University of Guelph is a world leader in advancing veterinary
          medicine and health research to improve the health of animals, people, and our planet. OVC educates the next
          generation of health leaders and provides high-value experiential learning opportunities through an
          interdisciplinary, comparative approach aimed at finding real-world solutions to real-world problems.
        </div>
      </div>
      <div className="flex justify-between ">
        <div>
          <Heading level={1} as={"h2"} className="font-condensed text-black">
            Social Media
          </Heading>
          Place holder
        </div>
        <div className="text-lg">
          <Heading level={1} as={"h2"} className="font-condensed text-black">
            Units
          </Heading>
          <ul>
            <li>
              <Link href="https://ovc.uoguelph.ca/biomedical-sciences/">Department of Biomedical Sciences</Link>
            </li>
            <li>
              <Link href="https://ovc.uoguelph.ca/clinical-studies/">Department of Clinical Studies</Link>
            </li>
            <li>
              <Link href="https://ovc.uoguelph.ca/pathobiology/">Department of Pathobiology</Link>
            </li>
            <li>
              <Link href="https://ovc.uoguelph.ca/population-medicine/">Department of Population Medicine</Link>
            </li>
            <li>
              <Link href="https://www.ovchsc.ca/">Health Sciences Centre</Link>
            </li>
          </ul>
        </div>
        <div className="text-lg">
          <Heading level={1} as={"h2"} className="font-condensed ">
            Connect with OVC
          </Heading>
          <ul className="lead font-weight-bold list-unstyled">
            <li>
              <Link href="https://www.google.com/maps/place/Ontario+Veterinary+College+Health+Sciences+Centre/@43.5312879,-80.2345029,17z/data=!3m1!4b1!4m5!3m4!1s0x882b9ad624240187:0x95a5348b4bf4b543!8m2!3d43.5312879!4d-80.2323142">
                Find us on a map
              </Link>
            </li>
            <li>
              <Link href="http://www.ovc.uoguelph.ca/recruitment/en/experienceovc/tours.asp">Take a tour</Link>
            </li>
            <li>
              <Link href="https://www.uoguelph.ca/ovc/contact">Contact</Link>
            </li>
            <li>
              <Link href="https://uoguelphca.sharepoint.com/sites/OntarioVeterinaryCollege">Intranet</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* </div> */}
    </Container>
  </div>
    );
  
};
