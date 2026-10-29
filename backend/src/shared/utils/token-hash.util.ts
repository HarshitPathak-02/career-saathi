import crypto from 'node:crypto';

/*
 * Refresh tokens are stored as SHA-256 hashes.
 * A database leak therefore cannot be used to
 * impersonate users with the leaked token value.
 */
export const hashToken = (
  token: string
): string =>
  crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

/*
 * Constant-time comparison for token hashes.
 */
export const tokenHashesMatch = (
  first: string,
  second: string
): boolean => {
  const firstBuffer = Buffer.from(first);

  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    firstBuffer,
    secondBuffer
  );
};
