/**
 * Development-only authentication bypass endpoint.
 *
 * This endpoint allows automatic login with development test accounts
 * identified by their "usr_" prefix, bypassing normal authentication flows.
 *
 * IMPORTANT: This endpoint is explicitly restricted to development environment.
 *
 * Security measures:
 * - Only accessible when NODE_ENV === "development"
 * - Restricted to accounts with "usr_" prefix (development test accounts only)
 * - Requires the account to exist in the database
 * - Uses the credential provider authentication flow
 * - Returns 404 in production environments
 *
 * @route GET /dev_only/login?id=usr_[id]
 * @returns Redirects to homepage with authentication cookies set
 */

import { getDB } from "@/libs/db";
import { auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // This route is only available in development mode
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not Found.", {
      status: 404, // Not Found
    });
  }

  // Getting user id from search params
  const url = new URL(request.url);
  const userId = url.searchParams.get("id") ?? "";

  // Enforce user IDs starting with "usr-" prefix (used in development seeds)
  // This ensures we only log in as development test accounts
  // Production user IDs use different prefixes, adding an extra security layer
  if (!userId.startsWith("usr_")) {
    return new Response("Invalid userId.", {
      status: 400, // Bad Request
    });
  }

  // Get the account associated with the userId
  const db = await getDB();
  const account = await db.query.account.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, userId), eq(table.providerId, "credential")),
  });

  if (!account) {
    return new Response("Account not found.", {
      status: 404, // Not Found
    });
  }

  const result = await auth.api.signInEmail({
    body: {
      email: account.accountId,
      password: "testing123", // This is a dummy password for testing purposes
    },
    asResponse: true,
    returnHeaders: true,
  });

  const headers = new Headers(result.headers);
  const redirectResponse = NextResponse.redirect(new URL("/", request.url));

  // copy all Set-Cookie headers to the redirect response
  const setCookie = headers.getSetCookie?.() || headers.get("set-cookie");
  if (setCookie) {
    // Handle both single and multiple cookies
    if (Array.isArray(setCookie)) {
      setCookie.forEach((cookie) => {
        redirectResponse.headers.append("Set-Cookie", cookie);
      });
    } else {
      redirectResponse.headers.set("Set-Cookie", setCookie);
    }
  }

  return redirectResponse;
}
