export const avatarUrl = url => url && url.startsWith('avatar/') ? `${process.env.BASE_URL}/${url}` : url;
