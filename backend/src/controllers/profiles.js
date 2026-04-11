const profilesService = require('../services/profiles');

/**
 * GET /profiles
 * Returns a filtered list of employee profiles.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listProfiles(req, res, next) {
  try {
    const filters = req.query;
    const profiles = await profilesService.listProfiles(filters);
    res.status(200).json({ success: true, data: profiles });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProfiles };
