import { Hono } from "hono";

import {
  createPost,
  deletePost,
  getCategoryById,
  getPostById,
  getPosts,
  updatePost,
} from "@/queries";
import { idParamValidator } from "@/utils";
import { zValidator } from "@hono/zod-validator";
import { postInsertSchema, postUpdateSchema } from "@/schema";

const posts = new Hono();

// GET all posts
posts.get("/", async (c) => {
  try {
    const posts = await getPosts();
    return c.json(posts, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET post by id
posts.get("/:id", idParamValidator(), async (c) => {
  try {
    const { id } = c.req.valid("param");
    const post = await getPostById(id);
    return c.json(post, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST create a post
posts.post("/", zValidator("json", postInsertSchema), async (c) => {
  try {
    const validatedPost = c.req.valid("json");

    const isCategoryFound = await getCategoryById(validatedPost.categoryId);

    if (!isCategoryFound) {
      return c.json({ message: "There is no categort with this id" }, 422);
    }

    const createdPost = await createPost(validatedPost);

    return c.json(createdPost, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PATCH update a post
posts.patch(
  "/:id",
  idParamValidator(),
  zValidator("json", postUpdateSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const validatedPost = c.req.valid("json");

      if (validatedPost.categoryId) {
        const isCategoryFound = await getCategoryById(validatedPost.categoryId);

        if (!isCategoryFound) {
          return c.json({ message: "There is no categort with this id" }, 422);
        }
      }

      const updatedPost = await updatePost(id, validatedPost);

      return c.json(updatedPost, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

posts.delete(
  "/:id",
  idParamValidator(),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const deleted = await deletePost(id);

      if (!deleted) return c.json({ error: "Post not found" }, 404);
      return c.json(deleted, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

export default posts;
