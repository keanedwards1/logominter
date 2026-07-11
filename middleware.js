// Vercel Edge Middleware — HTTP Basic Auth gate on every page.
//
// Protects the whole site while it is under construction. Credentials come from
// environment variables set in the Vercel dashboard (Settings → Environment
// Variables), never hard-coded here:
//   SITE_PASSWORD  (required — the gate fails CLOSED if this is unset)
//   SITE_USER      (optional — defaults to "logominter")
//
// A small allowlist of static assets is served without auth so the browser's
// login prompt and the coming-soon page can render their favicon/manifest.

export const config = {
  // Run on everything except Vercel internals. Asset filtering is done in code
  // below so the allowlist stays in one place.
  matcher: ["/((?!_next/|_vercel/).*)"],
};

// Files that must load before/around the auth prompt (icons, manifest, robots).
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

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LogoMinter", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  if (isPublicAsset(pathname)) {
    return; // serve asset without auth
  }

  const expectedPassword = process.env.SITE_PASSWORD;
  const expectedUser = process.env.SITE_USER || "logominter";

  // Fail closed: if no password is configured, deny everything.
  if (!expectedPassword) {
    return unauthorized();
  }

  const header = request.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    let decoded = "";
    try {
      decoded = atob(encoded);
    } catch {
      return unauthorized();
    }
    const sep = decoded.indexOf(":");
    const user = sep === -1 ? decoded : decoded.slice(0, sep);
    const pass = sep === -1 ? "" : decoded.slice(sep + 1);

    if (safeEqual(user, expectedUser) && safeEqual(pass, expectedPassword)) {
      return; // authenticated — continue to the requested page
    }
  }

  return unauthorized();
}
