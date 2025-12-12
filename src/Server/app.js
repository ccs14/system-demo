import * as Reddit from "../API/Reddit.js";
import express from "express";
import cors from "cors";
const app = express();

app.use(cors({ origin: true, credentials: true }));

app.get("/", async (req, res) => {
  res.json({
    healthCheck: true,
  });
});

app.get("/random", async (req, res) => {
  const subreddit = req.query.subreddit;
  const range = req.query.range;
  const data = await Reddit.getRandomPost(subreddit, range);

  res.json(Object.assign({}, data));
});

app.get("/top", async (req, res) => {
  const subreddit = req.query.subreddit;
  const range = req.query.range;
  const data = await Reddit.getTopPosts(subreddit, range);

  res.json(Object.assign({}, data));
});

app.listen(3001, (req, res) => {
  console.log("Server is running at port 3001");
});
