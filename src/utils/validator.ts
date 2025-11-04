import { zValidator } from "@hono/zod-validator";
import { z, type ZodType } from "zod";

export const idParamValidator = () =>
  zValidator("param", z.object({ id: z.uuid() }));

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
