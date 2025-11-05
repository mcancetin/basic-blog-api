import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(1309),
  DATABASE_URL: z.string(),
});

const env = EnvSchema.parse(Deno.env.toObject());

export default env;
