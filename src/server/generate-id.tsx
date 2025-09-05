/**
 * Generates a unique random article identifier.
 * The ID is random of number between 10,000,000 and 99,999,999.
 */
export function generateArticleId() {
  // Using crypto for cryptographically strong random numbers
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  // Scale to our range (10,000,000 to 99,999,999)
  const min = 10_000_000;
  const max = 99_999_999;
  const scaled = min + (array[0] % (max - min + 1));

  return scaled.toString();
}

/**
 * Generates a unique random post identifier.
 * The ID is random of number between  100,000,000 and 999,999,9999
 */
export function generatePostId() {
  // Using crypto for cryptographically strong random numbers
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  // Scale to our range (100,000,000 to 999,999,999)
  const min = 100_000_000;
  const max = 999_999_999;
  const scaled = min + (array[0] % (max - min + 1));

  return scaled.toString();
}

/**
 * Generates a unique random showcase identifier.
 * The ID is random of number between 1,000,000 and 9,999,999.
 */
export function generateShowcaseId() {
  // Using crypto for cryptographically strong random numbers
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  // Scale to our range (1,000,000 to 9,999,999)
  const min = 1_000_000;
  const max = 9_999_999;
  const scaled = min + (array[0] % (max - min + 1));

  return scaled.toString();
}
