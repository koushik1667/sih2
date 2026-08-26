const { createClient } = require('redis');

let client = null;
let isConnected = false;

/**
 * Redis client singleton.
 * Falls back gracefully if Redis is not available (dev / offline).
 */
async function getRedisClient() {
  if (client && isConnected) return client;

  client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          console.warn('⚠️  Redis: max reconnect attempts reached — running without cache');
          return new Error('Max retries reached');
        }
        return Math.min(retries * 200, 2000);
      },
    },
  });

  client.on('error', (err) => {
    if (isConnected) console.error('Redis error:', err.message);
    isConnected = false;
  });

  client.on('connect', () => {
    isConnected = true;
    console.log('✅ Redis connected');
  });

  client.on('end', () => {
    isConnected = false;
  });

  try {
    await client.connect();
  } catch (err) {
    console.warn('⚠️  Redis unavailable — caching disabled:', err.message);
    isConnected = false;
  }

  return client;
}

/**
 * Safe GET with fallback — returns null if Redis is down.
 */
async function cacheGet(key) {
  try {
    const c = await getRedisClient();
    if (!isConnected) return null;
    const val = await c.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

/**
 * Safe SET with TTL in seconds. Silently fails if Redis is down.
 */
async function cacheSet(key, value, ttlSeconds = 300) {
  try {
    const c = await getRedisClient();
    if (!isConnected) return;
    await c.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch {
    /* silent */
  }
}

/**
 * Safe DEL. Accepts single key or array.
 */
async function cacheDel(keys) {
  try {
    const c = await getRedisClient();
    if (!isConnected) return;
    const arr = Array.isArray(keys) ? keys : [keys];
    await Promise.all(arr.map(k => c.del(k)));
  } catch {
    /* silent */
  }
}

/**
 * Pattern-based invalidation. E.g. invalidate('weather:*').
 */
async function cacheInvalidatePattern(pattern) {
  try {
    const c = await getRedisClient();
    if (!isConnected) return;
    const keys = await c.keys(pattern);
    if (keys.length) await c.del(keys);
  } catch {
    /* silent */
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel, cacheInvalidatePattern };
