import { RedisClientType, createClient } from "redis";

let isReady = false;
let redisClient: RedisClientType;

async function getCache(): Promise<RedisClientType> {
  if (!isReady) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    })

    redisClient.on('error', (err) => console.error('Redis error', err))
    redisClient.on('connect', () => console.log('Redis connected'))
    redisClient.on('reconnecting', () => console.log('Redis reconnecting'))
    redisClient.on('ready', () => {
      console.log('Redis ready')
      isReady = true;
    })

    await redisClient.connect();
  }

  return redisClient;
}

getCache().then(connection => {
  redisClient = connection;
}).catch(err => {
  console.error('Redis error', err)
});

export {
  getCache,
}
