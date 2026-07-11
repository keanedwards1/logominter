// Vercel Edge Middleware — on-page password gate for the whole site.
//
// Protects the site while it is under construction. Instead of the browser's
// native Basic Auth popup, an unauthenticated visitor is served a styled login
// page (matching coming-soon.html). On a correct submit we set a signed,
// HTTP-only cookie so they stay in for SESSION_DAYS. The password itself lives
// only in an env var on Vercel's edge and is never sent to the browser.
//
// Environment variables (Vercel → Settings → Environment Variables):
//   SITE_PASSWORD  (required — the gate fails CLOSED if this is unset)
//
// The cookie value is an HMAC-SHA-256 signature (keyed by SITE_PASSWORD) over
// an expiry timestamp, so it cannot be forged without knowing the password and
// it automatically stops validating once expired.

export const config = {
  // Run on everything except Vercel internals. Asset filtering is in code below.
  matcher: ["/((?!_next/|_vercel/).*)"],
};

const COOKIE_NAME = "lm_gate";
const SESSION_DAYS = 7;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

// Files that must load before/around the login page (icons, manifest, robots).
const PUBLIC_PATHS = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/site.webmanifest",
  "/browserconfig.xml",
  "/logo-minter-favicon.ico",
  "/logo-minter-favicon-16x16.png",
  "/logo-minter-favicon-32x32.png",
  "/logo-minter-apple-touch-icon.png",
  "/logo-minter-android-chrome-192x192.png",
  "/logo-minter-android-chrome-512x512.png",
  "/logo-minter-mstile-150x150.png",
  "/logo-minter-safari-pinned-tab.svg",
]);

function isPublicAsset(pathname) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Icon/manifest asset extensions needed by the browser chrome.
  return /\.(?:ico|png|svg|webmanifest)$/i.test(pathname);
}

// Constant-time-ish string comparison to avoid trivial timing leaks.
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// --- Cookie signing (HMAC-SHA-256, keyed by the site password) --------------

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return toHex(sig);
}

// Cookie format: "<expiryMs>.<hexSignature>"
async function makeToken(secret) {
  const expiry = String(Date.now() + SESSION_MS);
  const sig = await sign(expiry, secret);
  return `${expiry}.${sig}`;
}

async function isValidToken(token, secret) {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const expiry = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;

  const expected = await sign(expiry, secret);
  return safeEqual(sig, expected);
}

function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  const jar = {};
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    jar[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return jar;
}

// --- Responses --------------------------------------------------------------

function loginPage({ error = false, status = 200 } = {}) {
  const errorHtml = error
    ? '<p class="error" role="alert">Incorrect password. Please try again.</p>'
    : "";

  return new Response(loginHtml(errorHtml), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function loginHtml(errorHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LogoMinter — Enter Password</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="theme-color" content="#0b0b0f" />
  <link rel="apple-touch-icon" sizes="180x180" href="/logo-minter-apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/logo-minter-favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/logo-minter-favicon-16x16.png" />
  <link rel="icon" type="image/x-icon" href="/logo-minter-favicon.ico" />
  <style>
    :root {
      --bg: #0b0b0f;
      --bg-glow: #17131f;
      --fg: #f5f4f7;
      --muted: #9a97a6;
      --accent: #c8a24a;
      --border: rgba(255, 255, 255, 0.1);
      --field: rgba(255, 255, 255, 0.04);
      --danger: #e06a6a;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #faf9f7;
        --bg-glow: #f1ede4;
        --fg: #16151a;
        --muted: #6a6772;
        --accent: #b8901f;
        --border: rgba(0, 0, 0, 0.1);
        --field: rgba(0, 0, 0, 0.03);
        --danger: #c0392b;
      }
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body {
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
      color: var(--fg);
      background:
        radial-gradient(60rem 60rem at 50% -20%, var(--bg-glow), transparent 60%),
        var(--bg);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    main {
      width: 100%;
      max-width: 26rem;
      text-align: center;
      animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    }
    @keyframes rise { from { opacity: 0; transform: translateY(12px); } }
    .logo {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.75rem;
      display: block;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
    }
    .eyebrow {
      display: inline-block;
      margin-bottom: 1.25rem;
      padding: 0.35rem 0.85rem;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
      border: 1px solid var(--border);
      border-radius: 999px;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: clamp(1.75rem, 5vw, 2.5rem);
      line-height: 1.1;
      letter-spacing: -0.02em;
      font-weight: 700;
    }
    p.sub {
      margin: 0 auto 1.75rem;
      max-width: 22rem;
      color: var(--muted);
      font-size: 1rem;
      line-height: 1.6;
    }
    .brand { color: var(--accent); }
    form { display: flex; flex-direction: column; gap: 0.75rem; }
    input[type="password"] {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      color: var(--fg);
      background: var(--field);
      border: 1px solid var(--border);
      border-radius: 12px;
      outline: none;
      transition: border-color 0.2s ease;
    }
    input[type="password"]:focus { border-color: var(--accent); }
    input[type="password"]::placeholder { color: var(--muted); }
    button {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: #0b0b0f;
      background: var(--accent);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.15s ease, filter 0.2s ease;
    }
    button:hover { transform: translateY(-1px); filter: brightness(1.05); }
    button:active { transform: translateY(0); }
    .error {
      margin: 0;
      color: var(--danger);
      font-size: 0.9rem;
      font-weight: 500;
    }
    footer {
      margin-top: 2.5rem;
      font-size: 0.8rem;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <main>
    <img class="logo" src="/logo-minter-android-chrome-192x192.png" alt="LogoMinter" width="72" height="72" />
    <span class="eyebrow">Under Construction</span>
    <h1>Enter Password</h1>
    <p class="sub">
      <span class="brand">LogoMinter</span> is private for now. Enter the
      password to take a look around.
    </p>
    <form method="POST" action="/">
      <input
        type="password"
        name="password"
        placeholder="Password"
        autocomplete="current-password"
        autofocus
        required
      />
      ${errorHtml}
      <button type="submit">Unlock</button>
    </form>
    <footer>&copy; <span id="year"></span> LogoMinter</footer>
  </main>
  <script>
    document.getElementById("year").textContent = new Date().getFullYear();
  </script>
</body>
</html>`;
}

function setCookieAndRedirect(token, url) {
  const headers = new Headers();
  headers.set("Location", url);
  headers.set("Cache-Control", "no-store");
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; Max-Age=${
      SESSION_MS / 1000
    }; HttpOnly; Secure; SameSite=Lax`
  );
  return new Response(null, { status: 303, headers });
}

// --- Main -------------------------------------------------------------------

export default async function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (isPublicAsset(pathname)) {
    return; // serve asset without auth
  }

  const expectedPassword = process.env.SITE_PASSWORD;

  // Fail closed: if no password is configured, deny everything.
  if (!expectedPassword) {
    return loginPage({ status: 503 });
  }

  // Handle a login submission (form POSTs the password).
  if (request.method === "POST") {
    let submitted = "";
    try {
      const form = await request.formData();
      submitted = String(form.get("password") || "");
    } catch {
      // fall through to error page
    }

    if (safeEqual(submitted, expectedPassword)) {
      const token = await makeToken(expectedPassword);
      // Redirect back to the origin root so the browser re-requests with cookie.
      return setCookieAndRedirect(token, url.origin + "/");
    }
    return loginPage({ error: true, status: 401 });
  }

  // Already authenticated? Check the signed cookie.
  const cookies = parseCookies(request);
  if (await isValidToken(cookies[COOKIE_NAME], expectedPassword)) {
    return; // let the request through to the real page
  }

  // Not authenticated — show the on-page login.
  return loginPage({ status: 401 });
}
