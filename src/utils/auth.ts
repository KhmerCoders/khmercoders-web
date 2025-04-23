import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { getDB } from "@/libs/db";
import * as schema from "@/libs/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(await getDB(), {
    provider: "sqlite",
    schema: schema,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

