// ApplaudIQ Web SDK example (vanilla) — auto-login token.
// Your SERVER mints a one-time token (it holds the aiq_embed_ secret). See MINTING.md.

export async function getEmbedToken() {
  // Demo: the dev mint server runs at http://localhost:8787 (web-integration/tools/mint-server.mjs).
  const res = await fetch('http://localhost:8787/mint', { method: 'POST' });
  if (!res.ok) throw new Error('mint failed (' + res.status + ')');
  const { embedToken } = await res.json();
  return embedToken;
}
