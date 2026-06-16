/** Shown when auto-login can't mint a token because no backend is wired yet. */
export function NeedsServerNotice() {
  return (
    <div className="aiq-callout">
      <h3>Auto-login needs a server</h3>
      <p>
        Wire <code>getEmbedToken()</code> in <code>src/useEmbedToken.ts</code> to your
        <code> /api/mint</code> endpoint — it exchanges your <code>aiq_embed_…</code> secret for a one-time
        token. See <strong>MINTING.md</strong>. Or try <strong>Manual login</strong> — it needs no server.
      </p>
    </div>
  );
}
