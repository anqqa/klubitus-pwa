'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const DEPRECATED_SALT_PATTERN = [1, 3, 5, 7, 11, 13, 17, 19, 23, 29];


/**
 * Deprecated hasher.
 *
 * @param    {string}  password
 * @param    {string}  [salt]
 * @returns  {string}
 */
const deprecatedHash = (password, salt) => {
  const sha1 = crypto.createHash('sha1');

  // Create a salt seed, same length as the number of offsets in the pattern
  if (!salt) {
    const saltHash = sha1.update(Math.random().toString(16).substring(2)).digest('hex');

    salt = saltHash.substring(0, DEPRECATED_SALT_PATTERN.length);
  }

  let hash           = sha1.update(salt + password).digest('hex');
  let hashedPassword = '';
  let saltCharacters = salt.split('');
  let lastOffset     = 0;

  DEPRECATED_SALT_PATTERN.forEach(offset => {

    // Split a new part of the hash off
    const part = hash.substring(0, offset - lastOffset);

    // Cut the current part out of the hash
    hash = hash.substring(offset - lastOffset);

    // Add the part to the password, appending the salt character
    hashedPassword += part + saltCharacters.shift();

    lastOffset = offset;
  });

  return hashedPassword + hash;
};


/**
 * Deprecated password matcher.
 *
 * @param    {string}  password
 * @param    {string}  passwordHash
 * @returns  {boolean}
 */
const deprecatedMatch = (password, passwordHash) => {
  const salt = deprecatedSalt(passwordHash);

  return deprecatedHash(password, salt) === passwordHash;
};


/**
 * Deprecated salt generator.
 *
 * @param    {string}  string
 * @returns  {string}
 */
const deprecatedSalt = (string) => {
  let salt = '';

  DEPRECATED_SALT_PATTERN.forEach((offset, index) => {
    salt += string[offset + index];
  });

  return salt;
};


/**
 * Hash password.
 *
 * @param    {string}  password
 * @returns  {string}
 */
const hash = (password) => {
  return bcrypt.hashSync(password, 10);
};


/**
 * Match password.
 *
 * @param    {string}  password
 * @param    {string}  passwordHash
 * @returns  {boolean}
 */
const match = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
};


module.exports = {
  deprecatedMatch,
  hash,
  match,
};
