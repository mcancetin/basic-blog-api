import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const postsTags = pgTable("posts_tags", {
  postId: uuid("post_id").notNull().references(() => posts.id),
  tagId: uuid("tag_id").notNull().references(() => tags.id),
}, (t) => [
  primaryKey({ columns: [t.postId, t.tagId] }),
]);

export const tagInsertSchema = createInsertSchema(tags).omit({ id: true });
export const tagUpdateSchema = createUpdateSchema(tags).omit({ id: true });

export const categoryInsertSchema = createInsertSchema(categories).omit({
  id: true,
});
export const categoryUpdateSchema = createInsertSchema(categories).omit({
  id: true,
});

export const postInsertSchema = createInsertSchema(posts).extend({
  tags: z.array(z.uuid()).optional(),
}).omit({ id: true });

export const postUpdateSchema = createUpdateSchema(posts).extend({
  tags: z.array(z.uuid()).optional(),
}).omit({ id: true });
