import { createEnv } from "@t3-oss/env-core";
import type { Request } from "express";
import { z, type AnyZodObject } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  client: {},
  server: {
    DB_URL: z.string().url().default("mongodb://localhost:27017/lucia-db"),
    PORT: z.number().int().default(3000),
  },
  runtimeEnv: process.env,
});

export function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request
): { success: false } | { success: true; data: z.infer<T> } {
  const parseResult = schema.safeParse(req);
  if (!parseResult.success) {
    console.log(
      `Error in Zod Validation: ${JSON.stringify(parseResult.error, null, 2)}`
    );
    return { success: false };
  }
  return parseResult;
}
