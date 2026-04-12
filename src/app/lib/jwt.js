/**
 * JWT Token Management
 * 
 * SECURITY CRITICAL: JWT_SECRET must be:
 * - 32+ random characters (use crypto.randomBytes(32).toString('hex'))
 * - Never exposed or hardcoded
 * - Stored only in environment variables
 * - Rotated if compromised
 * 
 * Generate production secret:
 * node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import jwt from "jsonwebtoken";

const WEAK_SECRETS = new Set([
  "supersecretkey",
  "your_super_strong_random_jwt_secret_here_min_32_chars",
]);

/**
 * Validates JWT_SECRET when signing or verifying tokens (not at module import).
 * Avoids crashing the dev server / route compilation when env is still loading.
 */
function assertJwtSecret() {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set");
  }
  if (SECRET.length < 32) {
    throw new Error(
      `FATAL: JWT_SECRET must be at least 32 characters (current: ${SECRET.length}). ` +
        `Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
    );
  }
  if (WEAK_SECRETS.has(SECRET)) {
    throw new Error(
      "FATAL: JWT_SECRET is using default/example value. " +
        "Generate a strong random secret with: " +
        `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
    );
  }
  return SECRET;
}

/**
 * Sign a JWT token
 * @param {Object} user - User object with _id, email, role
 * @returns {string} - Signed JWT token
 */
export const signToken = (user) => {
  const secret = assertJwtSecret();
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }, // 7-day expiration
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid
 */
export const verifyToken = (token) => {
  const secret = assertJwtSecret();
  return jwt.verify(token, secret);
};
