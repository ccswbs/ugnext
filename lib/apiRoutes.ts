// lib/apiRoutes.ts

export const API_ROUTES = {
  token: '/api/token',
  resource: '/api/resource',
  profile: (id: string | number) => `/api/profiles/${id}`,
};
