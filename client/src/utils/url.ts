export const avatarUrl = (url: string): string =>
  url && url.startsWith('avatar/') ? `${process.env.BASE_URL}/${url}` : url;
