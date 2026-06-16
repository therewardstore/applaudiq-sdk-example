<script lang="ts">
  import { Link } from 'svelte-routing';

  // svelte-routing's <Link> exposes a getProps hook with the current match info.
  // Home (`/`) must match exactly; the mode pages match their own path.
  const exact = ({ isCurrent }: { isCurrent: boolean }) => (isCurrent ? { class: 'active' } : {});
  const partial = ({ isPartiallyCurrent, isCurrent }: { isPartiallyCurrent: boolean; isCurrent: boolean }) =>
    isPartiallyCurrent || isCurrent ? { class: 'active' } : {};
</script>

<!-- App shell: sticky top nav with active highlighting. -->
<nav class="aiq-nav">
  <span class="aiq-brand">
    ApplaudIQ <span class="dot">·</span> Svelte
  </span>
  <div class="aiq-links">
    <Link to="/" getProps={exact}>Home</Link>
    <Link to="/auto" getProps={partial}>Auto-login</Link>
    <Link to="/manual" getProps={partial}>Manual login</Link>
  </div>
</nav>
