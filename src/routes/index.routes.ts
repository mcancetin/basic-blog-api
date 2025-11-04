import { Hono } from "hono";

import tags from "./tags.routes.ts";
import posts from "./posts.routes.ts";
import categories from "./categories.routes.ts";

const routes = new Hono();

routes.get("/", (c) => c.text("Hello from index"));
routes.route("/tags", tags);
routes.route("/posts", posts);
routes.route("/categories", categories);

export default routes;
