import axios from "axios";
import * as Redis from "../Messaging/Redis.js";
import * as RabbitMQ from "../Messaging/RabbitMQ.js";
import { info, warn, error, debug } from "../Logger/Logger.js";

export const getRandomPost = async (subredditName) => {
  try {
    const redditUrl = `http://www.reddit.com/r/${subredditName}/.json`;

    info(
      "🚀 ~ file: reddit.js:8 ~ getRandomPost ~ subredditName:",
      subredditName
    );
    info("🚀 ~ file: reddit.js:9 ~ getRandomPost ~ redditUrl:", redditUrl);

    const response = await axios.get(redditUrl);
    if (response && response.status === 200) {
      const children = response.data.data.children;

      const index = Math.floor(Math.random() * children.length);
      const randomPost = children[index].data;

      const post = {
        id: randomPost.id,
        title: randomPost.title,
        content: randomPost.selftext,
        url: randomPost.url,
        createdDate: new Date(randomPost.created_utc * 1000)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
      };

      // add response to cache
      const id = post.id;
      const key = subredditName + "_random_" + id;
      const data = JSON.stringify(post);

      // post to redis for cache
      await Redis.SimpleSet(key, data, 3600);

      // post to rabbitmq for analytics
      await RabbitMQ.sendMessage(data, "reddit_random_queue");

      return post;
    }
  } catch (e) {
    error("🚀 ~ file: reddit.js:17 ~ getRandomPost ~ error:", e.message);
    return {};
  }
};

export const getTopPosts = async (subredditName, range) => {
  try {
    const key = subredditName + "_top10_" + range;
    const res = await Redis.GetKeyAsync(key);
    if (res !== null) {
      info("🚀 ~ cache hit (key):", key);
      return res;
    }

    info("🚀 ~ cache miss (key):", key);

    const redditUrl = `http://www.reddit.com/r/${subredditName}/top/.json?sort=top&t=${range}`;
    info("🚀 ~ getTopPosts ~ subredditName:", subredditName);
    info("🚀 ~ getTopPosts ~ redditUrl:", redditUrl);

    const response = await axios.get(redditUrl);
    if (response && response.status === 200) {
      const children = response.data.data.children;

      const posts = [];
      // take the top10 in order, we only want to post the title and url to keep it small
      for (let i = 0; i < 10; i++) {
        let currentPost = children[i].data;
        let post = {
          title: currentPost.title,
          url: currentPost.url,
        };
        posts.push(post);
      }

      // add response to cache
      const data = JSON.stringify(posts);

      // add to cache
      await Redis.SimpleSet(key, data, 3600);

      // add message for analytics
      await RabbitMQ.sendMessage(data, "reddit_top_queue");

      return posts;
    }
  } catch (e) {
    error("🚀 ~ getTopPosts ~ error:", e.message);
    return {};
  }
};
