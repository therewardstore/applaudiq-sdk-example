// ApplaudIQ Web SDK example (vanilla) — shared top nav.
// The nav markup lives here in ONE place; each page injects it via renderNav().

// Inject the shared <nav> into `host` and mark `activePath`'s link active.
// `activePath` is the page file the active link points at, e.g. "index.html".
export function renderNav(activePath, host = document.getElementById('nav')) {
  if (!host) return;
  host.className = 'aiq-nav';
  host.innerHTML = `
    <span class="aiq-brand">
      ApplaudIQ <span class="dot">·</span> Vanilla JS
    </span>
    <div class="aiq-links">
      <a href="index.html">Home</a>
      <a href="auto.html">Auto-login</a>
      <a href="manual.html">Manual login</a>
    </div>
  `;

  // Adds `.active` to the nav link matching the current page.
  let page = activePath || location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
  if (page === '' || page === 'index.html') page = 'index.html';

  host.querySelectorAll('.aiq-links a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}
