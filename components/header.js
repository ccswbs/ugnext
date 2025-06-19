import { Header as HeaderComponent, HeaderLink, HeaderMenu, HeaderMenuItem } from "@uoguelph/react-components/header";

function SubNavigationItem({ title, url, items }) {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <HeaderMenu title={title}>
        {items.map((item, index) => (
          <HeaderMenuItem key={item.title + index}>
            <SubNavigationItem title={item.title} url={item.url} items={item.items} />
          </HeaderMenuItem>
        ))}
      </HeaderMenu>
    );
  }

  return <HeaderLink href={url}>{title}</HeaderLink>;
}

export function Header({ title, url, menu }) {
  return (
    <HeaderComponent title={title} url={url}>
      {menu?.map((item) => (
        <SubNavigationItem key={item.title} title={item.title} url={item.url} items={item.items} />
      ))}
    </HeaderComponent>
  );
}
