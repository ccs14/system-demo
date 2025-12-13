import axios from "axios";
import * as Redis from "../Messaging/Redis.js";
import * as RabbitMQ from "../Messaging/RabbitMQ.js";

export const getRandomPost = async (subredditName) => {
  const redditUrl = `http://www.reddit.com/r/${subredditName}/.json`;

  console.log(
    "🚀 ~ file: reddit.js:8 ~ getRandomPost ~ subredditName:",
    subredditName
  );
  console.log("🚀 ~ file: reddit.js:9 ~ getRandomPost ~ redditUrl:", redditUrl);

  try {
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
      await RabbitMQ.sendMessage(data);

      return post;
    }
  } catch (error) {
    console.log("🚀 ~ file: reddit.js:17 ~ getRandomPost ~ error:", error);
    return {};
  }
};

export const getTopPosts = async (subredditName, range) => {
  const redditUrl = `http://www.reddit.com/r/${subredditName}/top/.json?sort=top&t=${range}`;

  console.log("🚀 ~ getTopPosts ~ subredditName:", subredditName);
  console.log("🚀 ~ getTopPosts ~ redditUrl:", redditUrl);

  try {
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
      const key = subredditName + "_top10_" + range;
      const data = JSON.stringify(posts);

      // add to cache
      await Redis.SimpleSet(key, data, 3600);

      // add message for analytics
      await RabbitMQ.sendMessage(data);

      return posts;
    }
  } catch (error) {
    console.log("🚀 ~ getTopPosts ~ error:", error);
    return {};
  }
};
