import db from "../index.ts";
import { tagInsertSchema, tags, tagUpdateSchema } from "../schema.ts";
import { eq } from "drizzle-orm";

export async function getTags() {
  const items = await db.select().from(tags);
  return items;
}

export async function getTagById(id: string) {
  const items = await db.select().from(tags).where(eq(tags.id, id));
  return items[0] || null;
}

export async function createTag(tag: unknown) {
  const validatedTag = tagInsertSchema.parse(tag);

  const existing = await db.select().from(tags).where(
    eq(tags.name, validatedTag.name),
  );
  if (existing.length > 0) {
    return { ...existing[0], alreadyExists: true };
  }

  const [item] = await db.insert(tags).values(validatedTag).returning();
  return item;
}

export async function updateTag(tag: unknown) {
  const validatedTag = tagUpdateSchema.parse(tag);
  if (!validatedTag.id) return null;

  const [item] = await db.update(tags)
    .set(validatedTag)
    .where(eq(tags.id, validatedTag.id))
    .returning();

  return item || null;
}

export async function deleteTag(id: string) {
  const [deleted] = await db.delete(tags).where(eq(tags.id, id)).returning();
  return deleted || null;
}
