import { createClient } from "redis";

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
    console.log("🚀 ~ data from redis:", value);
    await redisClient.disconnect();
  } catch (err) {
    console.error(err.message);
  }
};

export const KeyExists = async (key) => {
  try {
    await redisClient.connect();
    const value = await redisClient.EXISTS(key);
    console.log("🚀 ~ file: Redis.js:26 ~ KeyExists ~ value:", value);
    const res = Object.assign({}, value);
    console.log("🚀 ~ TryGetKey ~ value:", JSON.stringify(res));
    await redisClient.disconnect();
    return value === 1;
  } catch (err) {
    console.error(err.message);
  }
};

export const GetKeyOrNullAsync = async (key) => {
  try {
    await redisClient.connect();
    const value = await redisClient.get(key);
    const res = Object.assign({}, value);
    console.log("🚀 ~ file: Redis.js:26 ~ GetKeyOrNullAsync ~ res:", res);
    await redisClient.disconnect();
    return res;
  } catch (err) {
    console.error(err.message);
  }
};

export const SetKeyAsync = async (key, value, expire = 300) => {
  try {
    await redisClient.connect();

    if (!KeyExists(key)) {
      const res = await redisClient.set(key, value, "EX", expire);
      console.log("🚀 ~ setting new key: ", res);
    } else {
      console.log("🚀 ~ key exists with key: ", key);
    }

    await redisClient.disconnect();
  } catch (err) {
    console.error(err.message);
  }
};

export const SimpleSet = async (key, value, expire = 300) => {
  try {
    await redisClient.connect();
    await redisClient.set(key, value, "EX", expire);
    await redisClient.disconnect();
  } catch (err) {
    console.error(err.message);
  }
};
