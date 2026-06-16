/** The transient "minting a token…" state shown before the auto-login embed mounts. */
export function EmbedLoading({ title, what }: { title: string; what: string }) {
  return (
    <section className="aiq-mode">
      <div className="aiq-subhead">
        <h2>{title}</h2>
        <span className="what">{what}</span>
        <span className="pill pill-right">opening…</span>
      </div>
      <div className="aiq-embed" />
    </section>
  );
}
