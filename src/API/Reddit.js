import axios from "axios";
import * as Redis from "../Redis/Redis.js";

export const getRandomPost = async (subredditName) => {
  const redditUrl = `http://www.reddit.com/r/${subredditName}/.json`;

  console.log(
    "🚀 ~ file: reddit.js:8 ~ getRandomPost ~ subredditName:",
    subredditName
  );
  console.log("🚀 ~ file: reddit.js:9 ~ getRandomPost ~ redditUrl:", redditUrl);

  try {
    console.log(`Reddit API response for '${redditUrl}':`);
    const response = await axios.get(redditUrl);
    if (response && response.status === 200) {
      const children = response.data.data.children;
      const randomPost =
        children[Math.floor(Math.random() * children.length)].data;

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
      await Redis.SimpleSet(key, JSON.stringify(post), 3600);

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
    console.log(`Reddit API response for '${redditUrl}':`);
    const response = await axios.get(redditUrl);
    if (response && response.status === 200) {
      const children = response.data.data.children;

      const posts = [];
      // take the top10 in order, we only want to post the title and url to keep it small
      for (let i = 0; i < 10; i++) {
        let currentPost = children[i].data;
        let p = {
          title: currentPost.title,
          url: currentPost.url,
        };
        posts.push(p);
      }

      // add response to cache
      const key = subredditName + "_top10_" + range;
      await Redis.SimpleSet(key, JSON.stringify(posts), 3600);

      return posts;
    }
  } catch (error) {
    console.log("🚀 ~ getTopPosts ~ error:", error);
    return {};
  }
};
