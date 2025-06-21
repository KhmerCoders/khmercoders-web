import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { getDB } from "@/libs/db";
import * as schema from "@/libs/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(await getDB(), {
    provider: "sqlite",
    schema: schema,
  }),
  emailAndPassword: {
    // Enable email/password authentication only in development mode
    // This allows for easier testing and debugging without requiring GitHub OAuth
    // In production, users will need to authenticate through GitHub
    enabled: process.env.NODE_ENV === "development",
  },
  user: {
    additionalFields: {
      reputation: {
        type: "number",
      },
      level: {
        type: "number",
      },
      storageUsed: {
        type: "number",
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
