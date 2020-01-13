export const enum Roles {
  ADMIN = 'admin',
  AUTHENTICATED = 'authenticated',
  NOBODY = 'nobody',
  UNAUTHENTICATED = 'unauthenticated',
  USER = 'user',
}

export const userRole = (id?: string | number): string => `${Roles.USER}:${id}`;
