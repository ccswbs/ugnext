import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGryphonStatue } from "@awesome.me/kit-7993323d0c/icons/kit/custom";
import {
  faBars,
  faFileSignature,
  faMapLocationDot,
  faCalendarDays,
} from "@awesome.me/kit-7993323d0c/icons/classic/solid";

export const Sidebar = ({ links = [] }) => {
  const defaultLinks = [
    {
      url: "https://www.uoguelph.ca/admission/undergraduate/apply/",
      text: "Apply Now!",
      icon: faGryphonStatue,
      highlight: true,
    },
    {
      url: "/programs/undergraduate",
      text: "View All Programs",
      icon: faBars,
    },
    {
      url: "https://www.uoguelph.ca/admission/undergraduate/tours/",
      text: "Register for a Campus Tour",
      icon: faMapLocationDot,
    },
    {
      url: "https://www.uoguelph.ca/registrar/forms/spf/",
      text: "Fill out our Student Profile Form",
      icon: faFileSignature,
    },
    {
      url: "https://www.uoguelph.ca/admission/undergraduate/apply/deadlines/",
      text: "Dates & Deadlines",
      icon: faCalendarDays,
    },
  ];

  return (
    <>
      <Heading level={3} as="h2" className="mt-7">
        More Information
      </Heading>

      <ul className="flex flex-col w-full gap-4">
        {[...(links ?? []), ...defaultLinks].map((link, index) => (
          <li key={link.url} className="w-full">
            <Button
              className="flex items-center justify-start gap-4 w-full"
              href={link.url}
              color={link?.highlight ? "red" : "black"}
            >
              {link.icon && <FontAwesomeIcon className="text-2xl" icon={link.icon} />}
              <span className="font-bold">{link.text}</span>
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};
