const { profiles } = require('../data/fakeDb');

/**
 * Fetch a filtered list of employee profiles.
 * @param {{ role?: string, location?: string, available?: string }} filters
 * @returns {Promise<object[]>}
 */
async function listProfiles(filters) {
  let result = profiles;

  if (filters.role) {
    result = result.filter((p) => p.role === filters.role);
  }
  if (filters.location) {
    result = result.filter((p) => p.location === filters.location);
  }
  if (filters.available !== undefined) {
    const available = filters.available === 'true';
    result = result.filter((p) => p.available === available);
  }

  return result;
}

module.exports = { listProfiles };
