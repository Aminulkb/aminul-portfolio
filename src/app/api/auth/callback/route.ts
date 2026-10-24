// GitHub OAuth login — step 2 of 2 for the /admin content panel (Decap CMS).
//
// GitHub redirects the popup here with a one-time `code`. We exchange it
// server-side for an access token (this is the one step that needs the
// client secret, which is why it can't happen in the browser) and hand the
// token back to the CMS running in the window that opened this popup, via
// the standard Decap/Netlify CMS `postMessage` handshake. The popup then
// closes itself; the owner is logged in to /admin.
//
// Note: no `runtime` export needed — Cache Components (next.config.ts)
// requires the Node.js runtime for every route, which this already uses by
// default.

import { NextRequest, NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE } from "@/lib/github-oauth";

function errorPage(message: string) {
  return new NextResponse(`<!doctype html><html><body><p>${message}</p></body></html>`, {
    status: 400,
    headers: { "Content-Type": "text/html" },
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return errorPage(
      "Admin panel login isn't configured yet: GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET are missing. See README.md “Admin Panel” for setup steps.",
    );
  }
  if (!code || !state || !cookieState || state !== cookieState) {
    return errorPage("Login could not be verified (missing or mismatched state). Please close this window and try again.");
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  if (!tokenResponse.ok) {
    return errorPage("GitHub did not respond to the login request. Please close this window and try again.");
  }

  const tokenData: { access_token?: string; error_description?: string } = await tokenResponse.json();

  if (!tokenData.access_token) {
    return errorPage(`GitHub login failed: ${tokenData.error_description ?? "unknown error"}.`);
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: "github" });

  const html = `<!doctype html>
<html>
  <body>
    <p>Logging in…</p>
    <script>
      (function () {
        function receiveMessage(e) {
          window.removeEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorization:github:success:${payload}", e.origin);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  const response = new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
