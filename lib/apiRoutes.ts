// lib/apiRoutes.ts

const UNIWEB_BASE_URL = process.env.NEXT_PUBLIC_UNIWEB_URL;

export const API_ROUTES = {
  token: `${UNIWEB_BASE_URL}/api/token`,
  resource: `${UNIWEB_BASE_URL}/api/resource`,
  profile: (id: string | number) => `${UNIWEB_BASE_URL}/api/profiles/${id}`,
};
