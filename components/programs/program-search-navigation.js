import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import { useRouter } from "next/router";
import Link from "next/link";

export const ProgramSearchNavigation = () => {
  const { pathname } = useRouter();
  const links = [
    { href: "/programs/undergraduate", label: "Undergraduate Programs" },
    { href: "/programs/graduate", label: "Graduate Programs" },
    { href: "/programs/certificate-and-diploma", label: "Certificate and Diplomas" },
    { href: "/programs/continuing-education", label: "Pre & Post University" },
  ];

  return (
    <Navigation>
      {links.map((link) => (
        <NavigationLink key={link.href} href={link.href} active={pathname === link.href} as={Link}>
          {link.label}
        </NavigationLink>
      ))}
    </Navigation>
  );
};
