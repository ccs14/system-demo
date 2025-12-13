import { createClient } from "redis";
import { info, warn, error, debug } from "../Logger/Logger.js";

const redisClient = createClient({
  socket: {
    host: "redis",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// debugging and healthcheck
export const loadSampleData = async () => {
  try {
    await redisClient.connect();
    await redisClient.set("test2", "value2");
    const value = await redisClient.get("test2");
    info("🚀 ~ data from redis:", value);
    await redisClient.disconnect();
  } catch (e) {
    error(e.message);
  }
};

export const KeyExists = async (key) => {
  try {
    await redisClient.connect();
    const value = await redisClient.EXISTS(key);
    info("🚀 ~ file: Redis.js:26 ~ KeyExists ~ value:", value);
    const res = Object.assign({}, value);
    info("🚀 ~ TryGetKey ~ value:", JSON.stringify(res));
    await redisClient.disconnect();
    return value === 1;
  } catch (e) {
    error(e.message);
  }
};

export const GetKeyOrNullAsync = async (key) => {
  try {
    await redisClient.connect();
    const value = await redisClient.get(key);
    const res = Object.assign({}, value);
    info("🚀 ~ file: Redis.js:26 ~ GetKeyOrNullAsync ~ res:", res);
    await redisClient.disconnect();
    return res;
  } catch (e) {
    error(e.message);
  }
};

export const SetKeyAsync = async (key, value, expire = 300) => {
  try {
    await redisClient.connect();

    if (!KeyExists(key)) {
      const res = await redisClient.set(key, value, "EX", expire);
      info("🚀 ~ setting new key: ", res);
    } else {
      info("🚀 ~ key exists with key: ", key);
    }

    await redisClient.disconnect();
  } catch (e) {
    error(e.message);
  }
};

export const SimpleSet = async (key, value, expire = 300) => {
  try {
    await redisClient.connect();
    await redisClient.set(key, value, "EX", expire);
    await redisClient.disconnect();
  } catch (e) {
    error(e.message);
  }
};
