import { eq, sql } from "drizzle-orm";

import db from "../index.ts";
import { categories, posts, postsTags, tags } from "@/schema";

export async function getPosts() {
  const items = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      category:
        sql`json_build_object('id', categories.id, 'name', categories.name)`.as(
          "category",
        ),
      tags: sql`
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name)
        ) FILTER (WHERE tags.id IS NOT NULL),
        '[]'
      )
    `.as("tags"),
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(postsTags, eq(posts.id, postsTags.postId))
    .leftJoin(tags, eq(postsTags.tagId, tags.id))
    .groupBy(posts.id, categories.id);
  return items;
}
