import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { Env } from "@/env";

export function createDb(env: Env) {
  return drizzle(env.DB, { schema });
}

