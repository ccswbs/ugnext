import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  value: string;
  label: string;
}

interface DefaultLink {
  href: string;
  label: string;
}

interface ProfileSearchNavigationProps {
  tabs?: Tab[] | null;
  selectedTab?: string | null;
  onTabChange?: ((value: string) => void) | null;
  useRouting?: boolean;
}

export const ProfileSearchNavigation = ({ 
  tabs = null, 
  selectedTab = null, 
  onTabChange = null,
  useRouting = true 
}: ProfileSearchNavigationProps) => {
  const pathname = usePathname();

  // Default hardcoded links for backward compatibility
  const defaultLinks: DefaultLink[] = [
    { href: "/people", label: "All" },
    { href: "/people/faculty", label: "Faculty" },
    { href: "/people/staff", label: "Staff" },
    { href: "/people/graduate", label: "Graduate Students" },
    { href: "/people/postgraduate", label: "Postdoctoral Scholars" },
  ];

  // Use provided tabs or fall back to default links
  const links = tabs || defaultLinks;

  if (useRouting) {
    // Original routing behavior
    return (
      <Navigation>
        {(links as DefaultLink[]).map((link) => (
          <NavigationLink key={link.href} href={link.href} active={pathname === link.href} as={Link}>
            {link.label}
          </NavigationLink>
        ))}
      </Navigation>
    );
  } else {
    // Filter behavior without routing
    return (
      <Navigation>
        {(links as Tab[]).map((tab) => (
          <NavigationLink 
            key={tab.value} 
            href="#"
            active={selectedTab === tab.value}
            onClick={(e) => {
              e.preventDefault();
              onTabChange && onTabChange(tab.value);
            }}
          >
            {tab.label}
          </NavigationLink>
        ))}
      </Navigation>
    );
  }
};
