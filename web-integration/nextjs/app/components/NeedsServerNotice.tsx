/** Shown when auto-login can't mint a token — the mint endpoint/secret isn't configured yet. */
export function NeedsServerNotice() {
  return (
    <div className="aiq-callout">
      <h3>Auto-login needs a server</h3>
      <p>
        The mint route <code>app/api/mint/route.ts</code> exchanges your <code>aiq_embed_…</code> secret for a
        one-time token, and the <code>app/lib/useEmbedToken.ts</code> hook calls it. It appears the mint
        endpoint or its secret isn&apos;t configured — set <code>APPLAUDIQ_SECRET</code> in{' '}
        <code>.env.local</code> to enable it (see <strong>MINTING.md</strong>). Or try{' '}
        <strong>Manual login</strong> — it needs no server.
      </p>
    </div>
  );
}
