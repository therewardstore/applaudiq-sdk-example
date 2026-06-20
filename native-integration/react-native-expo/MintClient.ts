import { Config } from './config';

/**
 * Returns a one-time `embedToken` for AUTO login. Manual login needs none of this.
 *
 * PRODUCTION: your backend mints the token (the `aiq_embed_` secret stays server-side) and you POST your
 * own mint endpoint (`Config.MINT_ENDPOINT`). For a quick LOCAL test, set `Config.TEST_EMBED_SECRET` and the
 * app mints directly against the portal — never ship a real secret in an app (it's extractable from the build).
 */
export async function getEmbedToken(): Promise<string> {
  if (Config.TEST_EMBED_SECRET) {
    const r = await fetch(`${Config.BASE_URL}/api/v1/embed/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.TEST_EMBED_SECRET}`,
      },
      body: JSON.stringify({ employee: { email: Config.DEMO_EMAIL }, autoProvision: true }),
    });
    const j = await r.json();
    return j?.data?.embedToken ?? j?.embedToken;
  }
  const r = await fetch(Config.MINT_ENDPOINT, { method: 'POST' });
  const j = await r.json();
  return j.embedToken;
}
