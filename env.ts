import { z } from "zod";

const EnvSchema = z.object({
  ENV: z.string().default("development"),
  PORT: z.coerce.number().default(1309),
  DATABASE_URL: z.string(),
});

const env = EnvSchema.parse(Deno.env.toObject());

export default env;
