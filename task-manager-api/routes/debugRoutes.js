const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cache = require('../utils/cache');

// Debug endpoints expose server internals, so they require a login too.
router.use(auth);

// GET /debug/cache-stats — hits, misses, hit rate, currently cached keys
router.get('/cache-stats', (req, res) => {
    res.status(200).json({ success: true, data: cache.getStats() });
});

// POST /debug/cache-flush — empty the cache and reset the counters
// (handy to force a clean "first request = MISS" between experiments)
router.post('/cache-flush', (req, res) => {
    cache.flushAll();
    res.status(200).json({ success: true, message: 'Cache flushed and counters reset' });
});

module.exports = router;