import { Header as HeaderComponent, HeaderLink, HeaderMenu, HeaderMenuItem } from "@uoguelph/react-components/header";
import {
  getMenuByPrimaryNavigation,
  getMenuByPrimaryNavigationLinkset,
  type ProcessedPrimaryNavigation,
} from "@/data/drupal/primary-navigation";

type Menu = NonNullable<Awaited<ReturnType<typeof getMenuByPrimaryNavigation>>>;
type MenuItem = Menu["items"][number];

async function HeaderSubNavigationItem({ item }: { item: MenuItem }) {
  if (item.children && item.children.length > 0) {
    return (
      <HeaderMenu title={item.title}>
        {item.url && (
          <HeaderMenuItem>
            <HeaderLink href={item.url}>{item.title}</HeaderLink>
          </HeaderMenuItem>
        )}

        {item.children.map((child, index) => (
          <HeaderMenuItem key={index}>
            <HeaderSubNavigationItem item={child as MenuItem} />
          </HeaderMenuItem>
        ))}
      </HeaderMenu>
    );
  }

  return <HeaderLink href={item.url ?? "#"}>{item.title}</HeaderLink>;
}

type HeaderProps = { primaryNavigation?: ProcessedPrimaryNavigation | null };

export async function Header({ primaryNavigation }: HeaderProps) {
  const menu = await getMenuByPrimaryNavigation(primaryNavigation);

  if (!menu) {
    return <HeaderComponent></HeaderComponent>;
  }

  const menuItems = [...menu.items];
  const topic = menuItems.shift() ?? null;

  return (
    <HeaderComponent
      title={topic?.title}
      url={topic?.url ?? undefined}
      variant={primaryNavigation?.headerVariant ?? "guelph"}
    >
      {menuItems.map((item, index) => (
        <HeaderSubNavigationItem key={index} item={item} />
      ))}
    </HeaderComponent>
  );
}
