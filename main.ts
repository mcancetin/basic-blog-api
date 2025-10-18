import env from "@/env";
import app from "./src/app.ts";

const PORT = env.PORT;
console.log(`Server is running on port ${PORT}`);

Deno.serve({ port: PORT }, app.fetch);
