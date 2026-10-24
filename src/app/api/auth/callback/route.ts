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

  // This page runs inside the popup Decap CMS opened. The handshake below is
  // Decap's own fixed protocol (it comes from decap-cms-lib-auth's
  // NetlifyAuthenticator, which the "github" backend uses even though it's
  // not Netlify): we announce "authorizing:github" to the opener, the opener
  // echoes it back to prove it's listening, then we send the token as
  // "authorization:github:success:<payload>" and the opener closes us.
  //
  // What's new here (none of it changes that protocol) is purely defensive:
  // - every step is wrapped so a thrown error becomes visible text instead
  //   of an silent, permanently-stuck "Logging in…" page.
  // - the first announce is repeated a few times, in case the very first
  //   postMessage lands before the opener's listener is fully ready.
  // - after ~12s with no response at all, we show a plain-language status
  //   and a manual close/retry button instead of spinning forever.
  const html = `<!doctype html>
<html>
  <body style="font-family: system-ui, sans-serif; padding: 24px; color: #24212B;">
    <p id="status">Logging in…</p>
    <p id="detail" style="color:#6B6574; font-size: 13px; white-space: pre-wrap;"></p>
    <button id="retry" style="display:none; margin-top:12px; padding:8px 16px;" onclick="window.close()">Close this window</button>
    <script>
      (function () {
        var statusEl = document.getElementById("status");
        var detailEl = document.getElementById("detail");
        var retryBtn = document.getElementById("retry");
        var payload = ${payload ? JSON.stringify(payload) : '"{}"'};
        var announceTimer = null;
        var announceCount = 0;
        var gaveUpTimer = null;
        var done = false;

        function showDetail(text) {
          detailEl.textContent = text;
        }

        function showStuck(reason) {
          if (done) return;
          statusEl.textContent = "Could not finish logging in.";
          showDetail(
            "Reason: " + reason +
            "\\n\\nPlease close this window and click \\"Login with GitHub\\" again. " +
            "If this keeps happening, take a screenshot of this exact text and send it back."
          );
          retryBtn.style.display = "inline-block";
        }

        function finish(ok, reason) {
          done = true;
          if (announceTimer) clearInterval(announceTimer);
          if (gaveUpTimer) clearTimeout(gaveUpTimer);
          if (!ok) showStuck(reason);
        }

        if (!window.opener || window.opener.closed) {
          finish(false, "window.opener is not available (the tab that opened this popup is gone or unreachable).");
          return;
        }

        function receiveMessage(e) {
          try {
            window.removeEventListener("message", receiveMessage, false);
            if (announceTimer) clearInterval(announceTimer);
            statusEl.textContent = "Logging in… (finishing up)";
            window.opener.postMessage("authorization:github:success:" + payload, e.origin);
            // Decap closes this window itself once it processes the message
            // above. If it hasn't after a couple of seconds, close it
            // ourselves so the owner isn't left staring at a dead popup.
            setTimeout(function () {
              if (!done) {
                done = true;
                try { window.close(); } catch (err) {}
              }
            }, 2500);
          } catch (err) {
            finish(false, "Error replying to the opener: " + err);
          }
        }

        window.addEventListener("message", receiveMessage, false);

        function announce() {
          announceCount++;
          try {
            window.opener.postMessage("authorizing:github", "*");
          } catch (err) {
            finish(false, "Error reaching the opener window: " + err);
          }
        }

        announce();
        announceTimer = setInterval(function () {
          if (done) return;
          if (announceCount >= 6) {
            finish(false, "No response from the admin tab after several attempts (it may have been closed or reloaded).");
            return;
          }
          announce();
        }, 2000);

        gaveUpTimer = setTimeout(function () {
          if (!done) finish(false, "Timed out waiting for the admin tab to respond.");
        }, 13000);
      })();
    </script>
  </body>
</html>`;

  const response = new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
