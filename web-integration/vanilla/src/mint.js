// ApplaudIQ Web SDK example (vanilla) — auto-login token.
// Your SERVER mints a one-time token (it holds the aiq_embed_ secret). See MINTING.md.

export function getEmbedToken() {
  // TODO: replace with a call to your backend, e.g.:
  //   const res = await fetch('/api/mint', { method: 'POST' });
  //   const { embedToken } = await res.json();
  //   return embedToken;
  return Promise.reject(
    new Error('Wire getEmbedToken() to your /api/mint endpoint (see MINTING.md)'),
  );
}
