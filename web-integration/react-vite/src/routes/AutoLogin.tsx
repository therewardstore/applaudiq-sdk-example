import { EmbedLoading } from '../components/EmbedLoading';
import { EmbedView } from '../components/EmbedView';
import { NeedsServerNotice } from '../components/NeedsServerNotice';
import { useEmbedToken } from '../useEmbedToken';

/** Auto-login route — mints a token first (see useEmbedToken), then renders the embed signed in. */
export function AutoLogin() {
  const token = useEmbedToken();

  if (token.status === 'needs-server') return <NeedsServerNotice />;
  if (token.status === 'loading') {
    return <EmbedLoading title="Auto-login" what="Minting a one-time token…" />;
  }

  return (
    <EmbedView
      title="Auto-login"
      what="Signed in silently with a server-minted token."
      mode="auto"
      token={token.token}
    />
  );
}
