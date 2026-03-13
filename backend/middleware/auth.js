// backend/middleware/auth.js
const { admin } = require("../config/firebase");

/**
 * Verifies the Firebase ID token sent in the Authorization header.
 * Attaches decoded token as req.user = { uid, email, name, ... }
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // uid, email, name, picture …
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Optional auth — attaches user if token present, continues either way.
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const decoded = await admin.auth().verifyIdToken(authHeader.split(" ")[1]);
      req.user = decoded;
    } catch (_) {}
  }
  next();
};

module.exports = { protect, optionalAuth };
