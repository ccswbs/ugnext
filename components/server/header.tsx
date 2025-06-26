import { Header as HeaderComponent, HeaderLink, HeaderMenu, HeaderMenuItem } from "@uoguelph/react-components/header";
import { getMenuByName } from "@/data/drupal/menu";

export async function Header({ name }: { name?: string }) {
  const menu = name ? await getMenuByName(name) : null;

  if (!menu) {
    return <HeaderComponent></HeaderComponent>;
  }

  console.log(menu);
  return <HeaderComponent></HeaderComponent>;
}
