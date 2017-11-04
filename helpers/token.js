// const debug = require('debug')('api:helper:token');
const crypto = require('crypto');
const base58 = require('bs58');

module.exports = {
  longSemiRandomHash,
  randomHash32,
  sha1,
};


/**
 * Create a meaningless long semi random string
 * to be used by ej. as token url
 * @param data
 * @returns string
 */
function longSemiRandomHash(data) {
  const randomBytes = 24;
  const start = base58.encode(crypto.randomBytes(randomBytes));
  const end = base58.encode(crypto.randomBytes(randomBytes));

  const sha = crypto.createHash('sha1');
  sha.update(data);

  const hash = sha.digest('hex');
  const middle = base58.encode(hash);

  return start + middle + end;
}

/**
 * Generate a random string
 * don't use if you need non collision id's
 * @returns string
 */
function randomHash32() {
  const randomBytes = 32;
  return base58.encode(crypto.randomBytes(randomBytes));
}

/**
 * Generate a SHA1 hash for the given param
 * @param data
 * @returns string
 */
function sha1(data) {
  const hash = crypto.createHash('sha1');
  hash.update(data);

  return hash.digest('hex');
}
