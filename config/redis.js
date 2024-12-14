import Redis from 'ioredis';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

// Create an instance of ioredis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null, // Optional, if your Redis is secured
  db: 0, // Default Redis DB
  ttl: 86400, // Default time to live for session data (in seconds)
});

// Event listeners for monitoring Redis connection
redisClient.on('connect', () => {
  console.log('Connected to Redis using ioredis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Implement custom Redis session store
class RedisStore extends session.Store {
  constructor(options) {
    super(options);
    this.client = options.client;
  }

  get(sid, callback) {
    this.client.get(sid, (err, sessionData) => {
      if (err) return callback(err);
      if (!sessionData) return callback();
      return callback(null, JSON.parse(sessionData));
    });
  }

  set(sid, session, callback) {
    this.client.set(sid, JSON.stringify(session), 'EX', 86400, callback);
  }

  destroy(sid, callback) {
    this.client.del(sid, callback);
  }
}

// Create an instance of RedisStore with ioredis client
const redisStore = new RedisStore({ client: redisClient });

// Export the Redis client and store instance
export { redisClient, redisStore };
