/**
 * Register a new user account.
 * @param {object} data
 * @returns {Promise<null>}
 */
async function register(data) {
  // TODO: implement user creation via Prisma
  // TODO: hash password before storing
  return null;
}

/**
 * Authenticate a user by email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<null>}
 */
async function login(email, password) {
  // TODO: look up user by email via Prisma
  // TODO: verify password hash
  // TODO: generate and return JWT
  return null;
}

module.exports = { register, login };
