import _ from "lodash";
import { eq, sql } from "drizzle-orm";

import db from "../index.ts";
import {
  categories,
  postInsertSchema,
  posts,
  postsTags,
  postUpdateSchema,
  tags,
} from "@/schema";
import { getTagById } from "@/queries";

const basePostsQuery = db
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

export async function getPosts() {
  const items = await basePostsQuery;
  return items;
}

export async function getPostById(id: string) {
  const [item] = await basePostsQuery.where(eq(posts.id, id));
  return item;
}

export async function createPost(post: unknown) {
  const validatedPost = postInsertSchema.parse(post);

  const [basePost] = await db.insert(posts).values(validatedPost)
    .returning();

  const tagPromises = validatedPost?.tags?.map(async (t) =>
    await getTagById(t)
  );

  if (tagPromises) {
    const tags = (await Promise.all(tagPromises)).filter(Boolean);
    const uniqueTags = _.uniqBy(tags, "id");

    await Promise.all(
      uniqueTags.map((t) =>
        db.insert(postsTags).values({
          postId: basePost.id,
          tagId: t.id,
        })
      ),
    );
  }

  const createdPost = await getPostById(basePost.id);
  return createdPost;
}

export async function updatePost(id: string, post: unknown) {
  const validatedPost = postUpdateSchema.parse(post);

  const [basePost] = await db.update(posts).set({
    updatedAt: new Date(),
    ...validatedPost,
  }).where(
    eq(posts.id, id),
  )
    .returning();

  const tagPromises = validatedPost?.tags?.map(async (t) =>
    await getTagById(t)
  );

  await db.delete(postsTags).where(eq(postsTags.postId, basePost.id));

  if (tagPromises) {
    const tags = (await Promise.all(tagPromises)).filter(Boolean);
    const uniqueTags = _.uniqBy(tags, "id");

    await Promise.all(
      uniqueTags.map((t) =>
        db.insert(postsTags).values({
          postId: basePost.id,
          tagId: t.id,
        })
      ),
    );
  }

  const createdPost = await getPostById(basePost.id);
  return createdPost;
}

export async function deletePost(id: string) {
  const deleted = await getPostById(id);

  await db.delete(postsTags).where(eq(postsTags.postId, id));
  await db.delete(posts).where(eq(posts.id, id));

  return deleted || null;
}
