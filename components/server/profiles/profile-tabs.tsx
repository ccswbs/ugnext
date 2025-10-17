import { getAllTypes } from "@/data/drupal/profile";
import { ProfileTabs as ProfileCategoryTabsClient } from "@/components/client/profiles/profile-tabs";

export async function ProfileTabs() {
  const types = await getAllTypes();
  return <ProfileCategoryTabsClient types={types} />;
}
