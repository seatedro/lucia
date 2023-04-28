import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  client: {},
  server: {
    DB_URL: z.string().url().default("mongodb://localhost:27017"),
    PORT: z.number().int().default(3000),
  },
  runtimeEnv: process.env,
});
