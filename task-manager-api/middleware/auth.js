const jwt = require('jsonwebtoken');

// Verifies the JWT from the "Authorization: Bearer <token>" header.
// On success: sets req.user = { id, iat, exp } and calls next().
// On failure: responds 401 (never lets jwt.verify crash the server).
function auth(req, res, next) {
    const header = req.headers.authorization;
    const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized: token missing',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError'
                ? 'Not authorized: token expired'
                : 'Not authorized: token invalid';
        return res.status(401).json({ success: false, message });
    }
}

module.exports = auth;