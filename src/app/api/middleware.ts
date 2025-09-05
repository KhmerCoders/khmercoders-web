import { getDB } from '@/libs/db';
import { auth } from '@/utils/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import * as schema from '@/libs/db/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextRequest, NextResponse } from 'next/server';

export type ApiAuthContext = {
  profile?: typeof schema.memberProfile.$inferSelect;
  session: typeof schema.session.$inferSelect;
  user: typeof schema.user.$inferSelect;
  db: DrizzleD1Database<typeof schema>;
  env?: CloudflareEnv;
};

/**
 * Middleware for API routes that require authentication
 * @param handler The API route handler function
 * @returns A wrapped handler function that includes authentication context
 */
export function withApiAuth<ResponseType = any>(
  handler: (
    req: NextRequest,
    authContext: ApiAuthContext
  ) => Promise<NextResponse<ResponseType> | Response>
) {
  return async function (req: NextRequest): Promise<NextResponse<ResponseType> | Response> {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();
    const profile = await db.query.memberProfile.findFirst({
      where: eq(schema.memberProfile.userId, session.user.id),
    });

    const { env } = await getCloudflareContext({ async: true });

    const authContext: ApiAuthContext = {
      db,
      profile,
      session: session.session as typeof schema.session.$inferSelect,
      user: session.user as typeof schema.user.$inferSelect,
      // Add Cloudflare environment when available
      env,
    };

    return handler(req, authContext);
  };
}

/**
 * Middleware for API routes that don't require authentication but can use it if available
 * @param handler The API route handler function
 * @returns A wrapped handler function that includes optional authentication context
 */
export function withOptionalApiAuth<ResponseType = any>(
  handler: (
    req: NextRequest,
    authContext: Partial<ApiAuthContext>,
    params: any
  ) => Promise<NextResponse<ResponseType> | Response>
) {
  return async function (
    req: NextRequest,
    params: any
  ): Promise<NextResponse<ResponseType> | Response> {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return handler(req, { db: await getDB() }, params);
    }

    const db = await getDB();
    const profile = await db.query.memberProfile.findFirst({
      where: eq(schema.memberProfile.userId, session.user.id),
    });

    const authContext: ApiAuthContext = {
      db,
      profile,
      session: session.session as typeof schema.session.$inferSelect,
      user: session.user as typeof schema.user.$inferSelect,
    };

    return handler(req, authContext, params);
  };
}
