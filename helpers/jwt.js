import { expressjwt } from "express-jwt";

/**
 * JWT authentication middleware.
 * Validates the Bearer token on protected routes.
 * On success, the decoded payload is available as req.auth.
 * Route-level admin enforcement is handled separately by adminMiddleware.js.
 */
function authJwt() {
  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
    getToken: (req) => req.cookies?.token || null,
  }).unless({
    path: [
      "/api/v1/users/login",
      "/api/v1/users/register",
      "/api/v1/csrf-token",
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      "/api/v1/health",
    ],
  });
}

export default authJwt;
