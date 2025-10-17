import { getAllCategories } from "@/data/drupal/profile";
import { ProfileCategoryTabs as ProfileCategoryTabsClient } from "@/components/client/profiles/profile-category-tabs";

export async function ProfileCategoryTabs() {
  const categories = await getAllCategories();
  return <ProfileCategoryTabsClient categories={categories} />;
}
