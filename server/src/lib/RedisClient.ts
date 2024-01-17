import { createClient } from "redis";
import config from "config";

const redisClient = createClient({
  url: config.get<string>("redisUrl"),
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connect succesfully");
    redisClient.set("try", "Welcome to Kakeibo");
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
