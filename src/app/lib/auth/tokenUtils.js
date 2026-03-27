/**
 * JWT Auth utilities for API routes
 * Extract and verify user from tokens
 */

import { verifyToken } from "../jwt";

/**
 * Extract user from JWT cookie
 * @param {object} req - Next.js request object
 * @returns {object|null} user object or null if invalid
 */
export const getUserFromToken = (req) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded; // { id, email, role }
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

/**
 * Verify user is authenticated
 * @param {object} req - Next.js request object
 * @returns {object} { isValid: boolean, user: object|null, error: string|null }
 */
export const verifyAuth = (req) => {
  const user = getUserFromToken(req);
  if (!user) {
    return {
      isValid: false,
      user: null,
      error: "Unauthorized: Invalid or missing token",
    };
  }
  return { isValid: true, user, error: null };
};

/**
 * Verify user is admin
 * @param {object} user - User object from JWT
 * @returns {boolean}
 */
export const isAdminUser = (user) => {
  return user && user.role === "admin";
};
