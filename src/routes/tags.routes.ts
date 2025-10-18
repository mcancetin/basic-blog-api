import { Hono } from "hono";

const tags = new Hono();

tags.get("/", (c) =>
  c.json({
    message: "Tags",
  }));

export default tags;
