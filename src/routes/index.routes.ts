import { Hono } from "hono";

import tags from "./tags.routes.ts";

const routes = new Hono();

routes.get("/", (c) => c.text("Hello from index"));
routes.route("/tags", tags);

export default routes;
