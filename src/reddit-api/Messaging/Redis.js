import { createClient } from "redis";
import { info, warn, error, debug } from "../Logger/Logger.js";

const redisClient = createClient({
  socket: {
    host: "redis",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const checkConnection = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const loadSampleData = async () => {
  try {
    await checkConnection();
    await redisClient.set("test2", "value2");
    const value = await redisClient.get("test2");
    info("🚀 ~ data from redis:", value);
  } catch (e) {
    error(e.message);
  } finally {
    try {
      if (redisClient.isOpen) {
        await redisClient.disconnect();
      }
    } catch {}
  }
};

export const GetKeyAsync = async (key) => {
  try {
    await checkConnection();
    const value = await redisClient.get(key);
    info("🚀 ~ GetKeyOrNullAsync ~ cache hit (key):", key);
    return value;
  } catch (e) {
    error(e.message);
    return null;
  } finally {
    try {
      if (redisClient.isOpen) {
        await redisClient.disconnect();
      }
    } catch {}
  }
};

export const SetKeyAsync = async (key, value, expire = 300) => {
  try {
    await checkConnection();
    const res = await redisClient.set(key, value, { EX: expire, NX: true });
    if (res === null) {
      info("🚀 ~ key exists with key:", key);
      return false;
    }
    info("🚀 ~ setting new key:", res);
    return true;
  } catch (e) {
    error(e.message);
    return false;
  } finally {
    try {
      if (redisClient.isOpen) {
        await redisClient.disconnect();
      }
    } catch {}
  }
};

export const SimpleSet = async (key, value, expire = 300) => {
  try {
    await checkConnection();
    await redisClient.set(key, value, { EX: expire });
  } catch (e) {
    error(e.message);
  } finally {
    try {
      if (redisClient.isOpen) {
        await redisClient.disconnect();
      }
    } catch {}
  }
};
