// Auto-login only. Produces the one-time `embedToken` the SDK needs. Two paths:
//  • PRODUCTION (default): fetch it from YOUR backend (MINT_ENDPOINT), which holds the aiq_embed_ SECRET.
//  • ⚠️ DEMO/TEST: if TEST_EMBED_SECRET is set, mint in-app (no backend) — never ship the secret.
// Manual login does NOT use this.
import { BASE_URL, MINT_ENDPOINT, DEMO_EMAIL, TEST_EMBED_SECRET } from './config';

function unwrap(body: { data?: { embedToken?: string }; embedToken?: string }): string {
  const token = body.data?.embedToken ?? body.embedToken;
  if (!token) throw new Error('Mint response had no embedToken');
  return token;
}

export async function getEmbedToken(): Promise<string> {
  if (TEST_EMBED_SECRET) {
    const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/api/v1/embed/sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TEST_EMBED_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee: { email: DEMO_EMAIL }, autoProvision: true }),
    });
    if (!res.ok) throw new Error(`Test mint failed (HTTP ${res.status})`);
    return unwrap(await res.json());
  }
  const res = await fetch(MINT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!res.ok) throw new Error(`Mint request failed — wire MINT_ENDPOINT to your server (HTTP ${res.status})`);
  return unwrap(await res.json());
}
