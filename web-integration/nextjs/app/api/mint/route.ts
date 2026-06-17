import { NextResponse } from 'next/server';

// Server-side mint endpoint — the ONLY place your aiq_embed_ SECRET appears.
// The browser calls POST /api/mint; this exchanges the secret for a one-time
// embedToken and returns ONLY the token. See MINTING.md.

const API_BASE = process.env.APPLAUDIQ_API_BASE ?? 'http://localhost:8000';
const SECRET = process.env.APPLAUDIQ_SECRET; // aiq_embed_… — set in .env.local / secret manager, NEVER in git

export async function POST() {
  if (!SECRET) {
    // Not configured yet — paste your secret into APPLAUDIQ_SECRET to enable auto-login.
    return NextResponse.json({ error: 'APPLAUDIQ_SECRET not set' }, { status: 501 });
  }

  // Identify the employee from YOUR session — never trust a client-supplied identity.
  const employee = { email: 'arulraj@vananam.com' }; // 👉 replace with your authenticated user

  const res = await fetch(`${API_BASE}/api/v1/embed/sessions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee, autoProvision: true }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'mint_failed' }, { status: 502 });
  }
  const body = await res.json();
  const data = body.data ?? body; // gateway wraps in { data }
  // Return ONLY the token to the browser — keep the secret server-side.
  return NextResponse.json({ embedToken: data.embedToken, expiresIn: data.expiresIn, hrPending: data.hrPending });
}
