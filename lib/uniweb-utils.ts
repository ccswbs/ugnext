import { API_ROUTES } from './apiRoutes';

export interface UniwebProfile {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

export async function getProfile(id: string): Promise<UniwebProfile> {
  const res = await fetch(API_ROUTES.profile(id));
  if (!res.ok) {
    throw new Error(`Failed to fetch profile with id ${id}`);
  }
  return res.json();
}
