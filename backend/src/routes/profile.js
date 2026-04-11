const { Router } = require('express');
const profileController = require('../controllers/profile');

const router = Router();

/**
 * GET /profile/:id
 * Fetch a single employee profile by ID.
 * // TODO: add auth middleware on protected routes
 * // TODO: define response shape
 * // TODO: connect Prisma service
 */
router.get('/:id', profileController.getProfile);

/**
 * POST /profile
 * Create a new employee profile.
 * // TODO: add auth middleware on protected routes
 * // TODO: define response shape
 * // TODO: connect Prisma service
 */
router.post('/', profileController.createProfile);

/**
 * PUT /profile/:id
 * Update an existing employee profile.
 * // TODO: add auth middleware on protected routes
 * // TODO: define response shape
 * // TODO: connect Prisma service
 */
router.put('/:id', profileController.updateProfile);

module.exports = router;
