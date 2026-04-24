// Auth enforcement has been disabled at the backend by request.
// Access control is handled on the frontend (admin layout + login flow).
// These middlewares are kept as no-ops so existing route wiring continues to work.
const requireAuth = (req, res, next) => next()

const requireRole = () => (req, res, next) => next()

module.exports = { requireAuth, requireRole }
