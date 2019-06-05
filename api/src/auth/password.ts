import { createHash } from 'crypto';

const DEPRECATED_SALT_PATTERN = [1, 3, 5, 7, 11, 13, 17, 19, 23, 29];

/**
 * Deprecated hasher.
 *
 * @param    {string}  password
 * @param    {string}  [salt]
 * @returns  {string}
 */
const deprecatedHash = (password: string, salt?: string): string => {
  const sha1 = createHash('sha1');

  // Create a salt seed, same length as the number of offsets in the pattern
  if (!salt) {
    const saltHash = sha1
      .update(
        Math.random()
          .toString(16)
          .substring(2),
      )
      .digest('hex');

    salt = saltHash.substring(0, DEPRECATED_SALT_PATTERN.length);
  }
  const saltCharacters = salt.split('');

  let hashPart = sha1.update(salt + password).digest('hex');
  let hashedPassword = '';
  let lastOffset = 0;

  DEPRECATED_SALT_PATTERN.forEach(offset => {
    // Split a new part of the hash off
    const part = hashPart.substring(0, offset - lastOffset);

    // Cut the current part out of the hash
    hashPart = hashPart.substring(offset - lastOffset);

    // Add the part to the password, appending the salt character
    hashedPassword += part + saltCharacters.shift();

    lastOffset = offset;
  });

  return hashedPassword + hashPart;
};

/**
 * Deprecated password matcher.
 *
 * @param    {string}  password
 * @param    {string}  passwordHash
 * @returns  {boolean}
 */
export const deprecatedMatch = (password: string, passwordHash: string): boolean => {
  const salt = deprecatedSalt(passwordHash);

  return deprecatedHash(password, salt) === passwordHash;
};

/**
 * Deprecated salt generator.
 *
 * @param    {string}  str
 * @returns  {string}
 */
const deprecatedSalt = (str: string): string => {
  let salt = '';

  DEPRECATED_SALT_PATTERN.forEach((offset, index) => {
    salt += str[offset + index];
  });

  return salt;
};
