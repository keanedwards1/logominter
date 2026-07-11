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

  const prompt = req.body?.prompt;
  if (typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "A non-empty 'prompt' is required." });
  }

  try {
    const { buffer, contentType } = await generateImage(prompt.trim());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("generate error:", error.message, error.detail || "");
    return res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Logo generation failed." });
  }
}
