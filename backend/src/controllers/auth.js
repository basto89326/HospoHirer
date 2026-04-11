const authService = require('../services/auth');

/**
 * POST /auth/register
 * Registers a new user (employee or business).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function register(req, res, next) {
  // TODO: extract fields from req.body
  // TODO: call authService.register(data)
  // TODO: return response envelope
}

/**
 * POST /auth/login
 * Authenticates a user and returns a session token.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function login(req, res, next) {
  // TODO: extract email + password from req.body
  // TODO: call authService.login(email, password)
  // TODO: return response envelope with token
}

module.exports = { register, login };
