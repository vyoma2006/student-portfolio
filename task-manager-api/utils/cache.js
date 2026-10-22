const NodeCache = require('node-cache');

// TTL (seconds) and an on/off switch are read from .env so you can run the
// "with cache" and "without cache" experiments without editing code:
//   CACHE_TTL=60            -> how long an entry lives (default 60)
//   CACHE_ENABLED=false     -> bypass the cache completely
const TTL = Number(process.env.CACHE_TTL) || 60;
const ENABLED = process.env.CACHE_ENABLED !== 'false';

// useClones:false -> we store plain JSON-ready objects and never mutate them,
// so there is no need to deep-copy on every read (faster).
const cache = new NodeCache({ stdTTL: TTL, checkperiod: 120, useClones: false });

// Hit / miss counters (supplementary problem)
const stats = { hits: 0, misses: 0 };

// Cache keys. ONE fixed string per thing, so repeated requests find the same entry.
const keys = {
    allTasks: 'all_tasks',
    task: (id) => `task_${id}`,
};

function get(key) {
    if (!ENABLED) return undefined; // cache bypassed: not counted as hit or miss
    const value = cache.get(key);
    if (value === undefined) stats.misses++;
    else stats.hits++;
    return value;
}

function set(key, value) {
    if (ENABLED) cache.set(key, value);
}

function del(...keyList) {
    cache.del(keyList);
}

function flushAll() {
    cache.flushAll();
    stats.hits = 0;
    stats.misses = 0;
}

function getStats() {
    const total = stats.hits + stats.misses;
    return {
        enabled: ENABLED,
        ttlSeconds: TTL,
        hits: stats.hits,
        misses: stats.misses,
        hitRate: total ? `${((stats.hits / total) * 100).toFixed(1)}%` : 'n/a',
        cachedKeys: cache.keys(),
    };
}

// Value for the X-Cache response header when the data came from MongoDB
const missLabel = ENABLED ? 'MISS' : 'BYPASS';

module.exports = { keys, get, set, del, flushAll, getStats, missLabel };