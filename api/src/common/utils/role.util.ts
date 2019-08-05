export const Roles = {
  ADMIN: 'admin',
  AUTHENTICATED: 'authenticated',
  USER: 'user',
};

export const userRole = (id?: string | number): string => `${Roles.USER}:${id}`;
