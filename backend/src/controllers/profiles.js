const profilesService = require('../services/profiles');

/**
 * GET /profiles
 * Returns a filtered list of employee profiles.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listProfiles(req, res, next) {
  // TODO: extract filter params from req.query
  // TODO: call profilesService.listProfiles(filters)
  // TODO: return response envelope
}

module.exports = { listProfiles };
