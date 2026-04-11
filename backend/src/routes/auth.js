const { Router } = require('express');
const authController = require('../controllers/auth');

const router = Router();

/**
 * POST /auth/register
 * Register a new user account (employee or business).
 * // TODO: add auth middleware on protected routes
 * // TODO: define response shape
 * // TODO: connect Prisma service
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * Authenticate a user and return a session token.
 * // TODO: add auth middleware on protected routes
 * // TODO: define response shape
 * // TODO: connect Prisma service
 */
router.post('/login', authController.login);

module.exports = router;
