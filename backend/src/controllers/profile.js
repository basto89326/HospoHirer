const profileService = require('../services/profile');

/**
 * GET /profile/:id
 * Returns a single employee profile by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /profile
 * Creates a new employee profile from req.body.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createProfile(req, res, next) {
  // TODO: extract fields from req.body
  
  // TODO: call profileService.createProfile(data)
  // TODO: return response envelope
}

/**
 * PUT /profile/:id
 * Updates an existing employee profile by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateProfile(req, res, next) {
  // TODO: extract id from req.params, fields from req.body
  // TODO: call profileService.updateProfile(id, data)
  // TODO: return response envelope
}

module.exports = { getProfile, createProfile, updateProfile };
