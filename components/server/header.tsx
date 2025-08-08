import { Header as HeaderComponent, HeaderLink, HeaderMenu, HeaderMenuItem } from "@uoguelph/react-components/header";
import { getMenuByName } from "@/data/drupal/menu";

type Menu = NonNullable<Awaited<ReturnType<typeof getMenuByName>>>;
type MenuItem = Menu["items"][number];

async function HeaderSubNavigationItem({ item }: { item: MenuItem }) {
  if (item.children && item.children.length > 0) {
    return (
      <HeaderMenu title={item.title}>
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

export async function Header({ name }: { name?: string }) {
  const menu = name ? await getMenuByName(name) : null;

  if (!menu) {
    return <HeaderComponent></HeaderComponent>;
  }

  const menuItems = [...menu.items];
  const topic = menuItems.shift() ?? null;

  return (
    <HeaderComponent title={topic?.title} url={topic?.url ?? undefined}>
      {menuItems.map((item, index) => (
        <HeaderSubNavigationItem key={index} item={item} />
      ))}
    </HeaderComponent>
  );
}
