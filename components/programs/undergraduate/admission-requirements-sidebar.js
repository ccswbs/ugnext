import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const AdmissionRequirementsSidebar = ({ links = [] }) => {
  return (
    <>
      <Heading level={3} as="h2" className="mt-7">
        More Information
      </Heading>

      <ul className="flex flex-col w-full gap-4 !list-none">
        {links.map((link, index) => (
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
