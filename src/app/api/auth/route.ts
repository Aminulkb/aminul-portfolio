// GitHub OAuth login — step 1 of 2 for the /admin content panel (Decap CMS).
//
// The CMS login button opens a popup to this route. We redirect the popup to
// GitHub's own authorize page; GitHub then redirects back to
// /api/auth/callback (step 2), which finishes the handshake.
//
// Requires two environment variables (see README.md "Admin Panel" section):
//   GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET
// from a GitHub OAuth App the project owner creates — this app cannot create
// one on your behalf, since that requires signing in to your own GitHub
// account.
//
// Note: no `runtime` export needed — Cache Components (next.config.ts)
// requires the Node.js runtime for every route, which this already uses by
// default. This route is inherently dynamic (reads request headers, sets a
// cookie), so nothing here needs a Cache-Components-safe static-shell helper.

import { NextRequest, NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE } from "@/lib/github-oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return new NextResponse(
      "Admin panel login isn't configured yet: GITHUB_OAUTH_CLIENT_ID is missing. See README.md “Admin Panel” for setup steps.",
      { status: 500 },
    );
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/callback`;
  const state = crypto.randomUUID();

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
