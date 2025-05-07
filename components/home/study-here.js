import { LinkCarousel } from "@/components/link-carousel";
import undergraduate from "@/img/leah-weller-environmental-engineering-u-of-g.jpg";
import graduate from "@/img/caroline-pottruff-landscape-architecture-u-of-g.jpg";
import international from "@/img/ryan-ahlers-theatre-studies-u-of-g.jpg";
import lifelong from "@/img/kathryn-knowles-jenna-schamowski-environmental-sciences-u-of-g.jpg";

export const StudyHere = () => {
  const links = [
    {
      image: {
        src: undergraduate.src,
        width: undergraduate.width,
        height: undergraduate.height,
        blurred: undergraduate.blurDataURL,
        alt: "Leah Weller and another student in lab coats looking at a computer screen.",
      },
      title: "Undergraduate Programs",
      url: "https://admission.uoguelph.ca/programs",
      caption: "Leah Weller - Environmental Engineering",
    },
    {
      image: {
        src: graduate.src,
        width: graduate.width,
        height: graduate.height,
        blurred: graduate.blurDataURL,
        alt: "Caroline Pottruff working in a forest with a hard hat on",
      },
      title: "Graduate Programs",
      url: "https://graduatestudies.uoguelph.ca/",
      caption: "Caroline Pottruff - Landscape Architecture",
    },
    {
      image: {
        src: international.src,
        width: international.width,
        height: international.height,
        blurred: international.blurDataURL,
        alt: "Ryan Ahlers adjusting a spotlight in a theatre",
      },
      title: "International",
      url: "https://www.uoguelph.ca/study-in-canada/",
      caption: "Ryan Ahlers - Theatre Studies",
    },
    {
      image: {
        src: lifelong.src,
        width: lifelong.width,
        height: lifelong.height,
        blurred: lifelong.blurDataURL,
        alt: "Kathryn Knowles & Jenna Schamowski working with bee hives",
      },
      title: "Continuing Studies",
      url: "https://www.uoguelph.ca/continuing-studies/",
      caption: "Kathryn Knowles & Jenna Schamowski - Environmental Sciences",
    },
  ];

  return <LinkCarousel links={links} />;
};
