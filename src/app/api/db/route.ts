import { createDb } from "@/db";
import { users } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  try {
    const { env } = getCloudflareContext();

    const db = createDb(env);

    const results = await db.select().from(users);

    console.log("Results=========>", results);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch database tables" },
      { status: 500 }
    );
  }
}

