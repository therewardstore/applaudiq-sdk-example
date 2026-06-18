// ApplaudIQ Web SDK example (vanilla) — auto-login token.
//
// ⚠️ This example is STATIC (served by `npx serve`), so there is no dev server to inject
//    your aiq_embed_ secret. Auto-login therefore needs a real BACKEND mint endpoint that
//    YOU host: it holds the secret, calls POST /api/v1/embed/sessions, and returns ONLY the
//    one-time embedToken to the browser. The secret must NEVER appear in this page.
//
//    The canonical backend mint route ships in the nextjs example:
//    web-integration/nextjs/app/api/mint/route.ts. Point the fetch below at your own
//    deployment of that endpoint. Manual login (manual.html) needs none of this.
//
// If the mint fails, the embedded Applaud IQ portal shows the error itself — the client
// renders no error UI.
export async function getEmbedToken() {
  // 👉 REPLACE with YOUR backend mint endpoint (see the nextjs app/api/mint/route.ts).
  //    Your backend derives the employee from its OWN session and adds the secret.
  const res = await fetch('/api/mint', { method: 'POST' });
  if (!res.ok) throw new Error('mint failed (' + res.status + ')');
  const body = await res.json();
  const embedToken = body.data?.embedToken ?? body.embedToken; // gateway wraps in { data }
  if (!embedToken) throw new Error('mint returned no token');
  return embedToken;
}
