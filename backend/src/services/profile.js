/**
 * Fetch a single employee profile by ID.
 * @param {string} id
 * @returns {Promise<null>}
 */
const { profiles } = require('../data/fakeDb');

async function getProfile(id) {
  return profiles.find((p) => p.id === id) || null;
}

/**
 * Create a new employee profile.
 * @param {object} data
 * @returns {Promise<null>}
 */
async function createProfile(data) {
  // TODO: implement Prisma create
  return null;
}

/**
 * Update an existing employee profile by ID.
 * @param {string} id
 * @param {object} data
 * @returns {Promise<null>}
 */
async function updateProfile(id, data) {
  // TODO: implement Prisma update
  return null;
}

module.exports = { getProfile, createProfile, updateProfile };
