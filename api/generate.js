// Serverless logo generation endpoint.
//
// Accepts POST { prompt } and returns raw image bytes so the frontend's
// response.blob() -> dataURL flow works unchanged.
//
// Provider: Cloudflare Workers AI (FLUX.1 [schnell]) on the free tier.
// The provider call is isolated in generateImage() so swapping to Recraft /
// Ideogram later is a single-function change.
//
// Env vars (set in .env.local and Vercel -> Settings -> Environment Variables):
//   CLOUDFLARE_ACCOUNT_ID   required
//   CLOUDFLARE_API_TOKEN    required (Workers AI permission)

const CF_MODEL = "@cf/black-forest-labs/flux-1-schnell";

// Prompts longer than this are almost certainly abuse/junk — cap to protect the
// upstream quota and keep generations sane.
const MAX_PROMPT_LENGTH = 1200;

// --- Rate limiting ----------------------------------------------------------
//
// Best-effort per-IP sliding window held in module memory. Serverless instances
// are ephemeral and not shared, so this survives only within a warm instance —
// enough to stop casual hammering and accidental loops, not a determined
// attacker. Swap the store for Vercel KV / Upstash if that becomes a concern.

const RATE_LIMIT_MAX = 8; // requests per window per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

const rateBuckets = new Map(); // ip -> number[] (request timestamps in window)

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

// Returns { limited, retryAfter } where retryAfter is seconds until a slot frees.
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const hits = (rateBuckets.get(ip) || []).filter((t) => t > windowStart);

  if (hits.length >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((hits[0] + RATE_LIMIT_WINDOW_MS - now) / 1000);
    rateBuckets.set(ip, hits);
    return { limited: true, retryAfter: Math.max(retryAfter, 1) };
  }

  hits.push(now);
  rateBuckets.set(ip, hits);

  // Opportunistic cleanup so the map can't grow unbounded on a warm instance.
  if (rateBuckets.size > 5000) {
    for (const [key, times] of rateBuckets) {
      if (times.every((t) => t <= windowStart)) rateBuckets.delete(key);
    }
  }

  return { limited: false };
}

async function generateImage(prompt) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    const err = new Error("Image provider is not configured.");
    err.statusCode = 503;
    throw err;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CF_MODEL}`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    // 429 from Cloudflare means the account's daily free Neurons are exhausted
    // (resets 00:00 UTC) or we're being throttled. Surface it as 429 so the
    // client can show a "we're at capacity" message rather than a generic error.
    if (upstream.status === 429) {
      const err = new Error("The free daily generation limit has been reached.");
      err.statusCode = 429;
      err.detail = detail;
      throw err;
    }
    const err = new Error(`Upstream provider error (${upstream.status}).`);
    err.statusCode = 502;
    err.detail = detail;
    throw err;
  }

  const json = await upstream.json();
  const b64 = json?.result?.image;
  if (!b64) {
    const err = new Error("Upstream provider returned no image.");
    err.statusCode = 502;
    throw err;
  }

  const buffer = Buffer.from(b64, "base64");
  return { buffer, contentType: detectContentType(buffer) };
}

// Sniff the image format from magic bytes — the provider's output format
// (FLUX schnell currently returns JPEG) isn't guaranteed, so don't assume.
function detectContentType(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  if (buffer[0] === 0x3c) return "image/svg+xml"; // '<'
  return "application/octet-stream";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { limited, retryAfter } = checkRateLimit(clientIp(req));
  if (limited) {
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({
      error: "Too many requests. Please wait a moment before trying again.",
      retryAfter,
    });
  }

  const prompt = req.body?.prompt;
  if (typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "A non-empty 'prompt' is required." });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res
      .status(400)
      .json({ error: `Prompt is too long (max ${MAX_PROMPT_LENGTH} characters).` });
  }

  try {
    const { buffer, contentType } = await generateImage(prompt.trim());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("generate error:", error.message, error.detail || "");
    if (error.statusCode === 429 && error.retryAfter) {
      res.setHeader("Retry-After", String(error.retryAfter));
    }
    return res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Logo generation failed." });
  }
}
