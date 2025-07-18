import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const PeopleSearchNavigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/people", label: "All" },
    { href: "/people/faculty", label: "Faculty" },
    { href: "/people/staff", label: "Staff" },
    { href: "/people/graduate", label: "Graduate Students" },
    { href: "/people/postgraduate", label: "Postdoctoral Scholars" },
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
