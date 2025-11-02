import db from "../index.ts";
import {
  categories,
  categoryInsertSchema,
  categoryUpdateSchema,
} from "../schema.ts";

import { eq } from "drizzle-orm";

export async function getCategories() {
  const items = await db.select().from(categories);
  return items;
}

export async function getCategoryById(id: string) {
  const items = await db.select().from(categories).where(eq(categories.id, id));
  return items[0] || null;
}

export async function createCategory(category: unknown) {
  const validatedCategory = categoryInsertSchema.parse(category);

  const existing = await db.select().from(categories).where(
    eq(categories.name, validatedCategory.name),
  );
  if (existing.length > 0) {
    return { ...existing[0], alreadyExists: true };
  }

  const [item] = await db.insert(categories).values(validatedCategory)
    .returning();
  return item;
}

export async function updateCategory(category: unknown) {
  const validatedCategory = categoryUpdateSchema.parse(category);
  if (!validatedCategory.id) return null;

  const [item] = await db.update(categories)
    .set(validatedCategory)
    .where(eq(categories.id, validatedCategory.id))
    .returning();

  return item || null;
}

export async function deleteCategory(id: string) {
  const [deleted] = await db.delete(categories).where(eq(categories.id, id))
    .returning();
  return deleted || null;
}
