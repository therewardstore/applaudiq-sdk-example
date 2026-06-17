// Local demo-only mint server (NOT part of the shipped examples).
// Shared by the client-only examples (react-vite, vue, svelte, angular, vanilla) so
// their /api/mint proxy has something to hit. Mirrors nextjs/app/api/mint/route.ts.
//
// The aiq_embed_ SECRET stays here on the server — it never reaches the browser.
//   APPLAUDIQ_SECRET=aiq_embed_… APPLAUDIQ_API_BASE=http://localhost:3017 node tools/mint-server.mjs
import { createServer } from "node:http";

const PORT = Number(process.env.MINT_PORT ?? 8787);
const API_BASE = process.env.APPLAUDIQ_API_BASE ?? "http://localhost:3017";
const SECRET = process.env.APPLAUDIQ_SECRET;
const EMPLOYEE_EMAIL = process.env.DEMO_EMPLOYEE_EMAIL ?? "arulraj@vananam.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    return res.end();
  }
  // Accept both /mint and /api/mint so it works whether proxied or called directly.
  if (req.method !== "POST" || !/^\/(api\/)?mint\/?$/.test(req.url ?? "")) {
    res.writeHead(404, cors);
    return res.end("not found");
  }
  if (!SECRET) {
    res.writeHead(501, { ...cors, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "APPLAUDIQ_SECRET not set" }));
  }

  try {
    const upstream = await fetch(`${API_BASE}/api/v1/embed/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee: { email: EMPLOYEE_EMAIL },
        autoProvision: false,
      }),
    });
    if (!upstream.ok) {
      const text = await upstream.text();
      console.error(`[mint] upstream ${upstream.status}: ${text}`);
      res.writeHead(502, { ...cors, "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "mint_failed", status: upstream.status }),
      );
    }
    const body = await upstream.json();
    const data = body.data ?? body; // gateway wraps in { data }
    res.writeHead(200, { ...cors, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        embedToken: data.embedToken,
        expiresIn: data.expiresIn,
        hrPending: data.hrPending,
      }),
    );
  } catch (e) {
    console.error("[mint] error", e);
    res.writeHead(502, { ...cors, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "mint_error", message: String(e?.message ?? e) }),
    );
  }
});

server.listen(PORT, () => {
  console.log(
    `[mint] dev mint server on http://localhost:${PORT}  → ${API_BASE}/api/v1/embed/sessions  (employee: ${EMPLOYEE_EMAIL})`,
  );
  if (!SECRET)
    console.warn(
      "[mint] WARNING: APPLAUDIQ_SECRET is not set — mint will return 501.",
    );
});
