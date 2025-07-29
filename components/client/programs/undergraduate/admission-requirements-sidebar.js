import { Button } from "@uoguelph/react-components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnstyledLink } from "@/components/unstyled-link";
import { Typography } from "@uoguelph/react-components/typography";

export const AdmissionRequirementsSidebar = ({ links = [] }) => {
  return (
    <>
      <Typography type="h3" as="h2" className="mt-7">
        More Information
      </Typography>

      <ul className="flex flex-col w-full gap-4">
        {links.map((link, index) => (
          <li key={link.url} className="w-full">
            <Button
              className="flex items-center justify-start gap-4 w-full"
              href={link.url}
              color={link?.highlight ? "red" : "black"}
              as={UnstyledLink}
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
