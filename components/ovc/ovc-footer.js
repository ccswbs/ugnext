import { Container } from "@uoguelph/react-components/container";
import { Link } from "@uoguelph/react-components/link";
import { Typography } from "@uoguelph/react-components/typography";
import Image from "next/image";
import ovcCrest from "@/img/ovc/OVC-crest.png";

export const OVCFooter = () => {
  return (
    <div className={"w-full py-5 bg-gray-100"}>
      <Container>
        <div className="grid items-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-[2fr_5fr] ">
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
          <div className="text-lg">
            The Ontario Veterinary College (OVC) at the University of Guelph is a world leader in advancing veterinary
            medicine and health research to improve the health of animals, people, and our planet. OVC educates the next
            generation of health leaders and provides high-value experiential learning opportunities through an
            interdisciplinary, comparative approach aimed at finding real-world solutions to real-world problems.
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-8">
          <div>
            <div className="md:flex flex-wrap gap-3 mt-8">
              <a href="https://instagram.com/ontvetcollege/" className="btn btn-outline-secondary text-dark-social">
                <span className="sr-only">Connect with OVC on Instagram</span>
                <i className="fa-brands fa-instagram text-xl p-1" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.linkedin.com/school/ontario-veterinary-college/"
                className="border border-gray-400 rounded px-2 py-1 text-gray-700 hover:bg-gray-200 transition"
              >
                <span className="sr-only">Connect with OVC on LinkedIn</span>
                <i className="fa-brands fa-linkedin text-xl p-1" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.facebook.com/ontvetcollege"
                className="border border-gray-400 rounded px-2 py-1 text-gray-700 hover:bg-gray-200 transition"
              >
                <span className="sr-only">Connect with OVC on Facebook</span>
                <i className="fa-brands fa-facebook text-xl p-1" aria-hidden="true"></i>
              </a>
              <a
                href="https://twitter.com/OntVetCollege/"
                className="border border-gray-400 rounded px-2 py-1 text-gray-700 hover:bg-gray-200 transition"
              >
                <span className="sr-only">Connect with OVC on Twitter</span>
                <i className="fa-brands fa-x-twitter text-xl p-1" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.youtube.com/user/OntarioVetCollege"
                className="border border-gray-400 rounded px-2 py-1 text-gray-700 hover:bg-gray-200 transition"
              >
                <span className="sr-only">Connect with OVC on YouTube</span>
                <i className="fa-brands fa-youtube text-xl p-1" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div className="text-lg">
            <Typography type="h1" as="h2" className="font-condensed text-black">
              Units
            </Typography>
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
            <Typography type="h1" as="h2" className="font-condensed">
              Connect with OVC
            </Typography>
            <ul className="font-bold list-none mt-2 space-y-1">
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
