import { Hono } from "hono";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/queries";
import { categoryInsertSchema } from "../db/schema.ts";
import { idParamValidator, validate } from "@/utils";

const categories = new Hono();

categories.get("/", async (c) => {
  try {
    const categories = await getCategories();
    return c.json(categories, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

categories.get(
  "/:id",
  idParamValidator(),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const category = await getCategoryById(id);
      if (!category) return c.json({ error: "Category not found" }, 404);
      return c.json(category, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

categories.post("/", validate("json", categoryInsertSchema), async (c) => {
  try {
    const validatedCategory = c.req.valid("json");
    const category = await createCategory(validatedCategory);

    const isDuplicate = "alreadyExists" in category &&
      category.alreadyExists === true;
    const status = isDuplicate ? 200 : 201;

    return c.json(category, status);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

categories.patch(
  "/:id",
  idParamValidator(),
  validate("json", categoryInsertSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const updateData = c.req.valid("json");
      const category = await updateCategory({ id, ...updateData });

      if (!category) return c.json({ error: "Category not found" }, 404);
      return c.json(category, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

categories.delete(
  "/:id",
  idParamValidator(),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const deleted = await deleteCategory(id);
      if (!deleted) return c.json({ error: "Category not found" }, 404);
      return c.json(deleted, 200);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

export default categories;
