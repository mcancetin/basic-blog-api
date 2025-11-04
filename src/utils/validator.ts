import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";

export function validate<T extends ZodType>(
  type: "json" | "param" | "query",
  schema: T,
) {
  return zValidator(type, schema, (result, c) => {
    if (!result.success) {
      const { issues } = result.error;

      return c.json(
        {
          success: false,
          error: {
            name: "ZodError",
            message: "Validation failed",
            issues: issues,
          },
        },
        422,
      );
    }
  });
}
