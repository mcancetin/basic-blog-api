import { Hono } from "hono";

import { getPosts } from "@/queries";

const posts = new Hono();

// GET all tags
posts.get("/", async (c) => {
  try {
    const tags = await getPosts();
    return c.json(tags, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default posts;
