export const imageUrl = (id?: number, path?: string, postfix?: string): string => {
  // AWS S3 URL
  if (path) {
    return `https://${process.env.AWS_BUCKET}/${path}`;
  }

  // Convert numeric id to path, e.g. 1234567 -> 01/23/45
  const hex = id.toString(16).padStart(8, '0');
  const chunks = hex.match(/.{1,2}/g);
  chunks.pop();

  return `https://images.klubitus.org/${chunks.join('/')}/${id}_${postfix}.jpg`;
};
