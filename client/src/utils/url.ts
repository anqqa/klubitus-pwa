export const avatarUrl = (url: string): string =>
  url && url.startsWith('avatar/') ? `/${url}` : url;
