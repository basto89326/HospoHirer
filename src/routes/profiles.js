const { Router } = require('express');
const profilesController = require('../controllers/profiles');

const router = Router();

/**
 * GET /profiles
 * Browse and filter all employee profiles.
 * Supports query params: role, location, available
 * // TODO: add auth middleware on protected routes
 * // TODO: define response shape
 * // TODO: connect Prisma service
 */
router.get('/', profilesController.listProfiles);

module.exports = router;
