import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

import {
  createTag,
  deleteTag,
  getTagById,
  getTags,
  updateTag,
} from "@/queries";
import { tagInsertSchema } from "../db/schema.ts";

const tags = new Hono();

// GET all tags
tags.get("/", async (c) => {
  try {
    const tags = await getTags();
    return c.json(tags, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET tag by ID
tags.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.string().uuid() }),
  ),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const tag = await getTagById(id);
      if (!tag) return c.json({ error: "Tag not found" }, 404);
      return c.json(tag, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

// POST create tag
tags.post("/", zValidator("json", tagInsertSchema), async (c) => {
  try {
    const validatedTag = c.req.valid("json");
    const tag = await createTag(validatedTag);

    const isDuplicate = "alreadyExists" in tag && tag.alreadyExists === true;
    const status = isDuplicate ? 200 : 201;

    return c.json(tag, status);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PATCH update tag
tags.patch(
  "/:id",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", tagInsertSchema.partial()),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const updateData = c.req.valid("json");
      const tag = await updateTag({ id, ...updateData });

      if (!tag) return c.json({ error: "Tag not found" }, 404);
      return c.json(tag, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

// DELETE tag
tags.delete(
  "/:id",
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const deleted = await deleteTag(id);
      if (!deleted) return c.json({ error: "Tag not found" }, 404);
      return c.json(deleted, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

export default tags;
