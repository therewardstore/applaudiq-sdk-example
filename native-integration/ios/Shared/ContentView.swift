import ApplaudIQEmbed
import SwiftUI

/// Two ways to open the embed:
///  • Manual login — no server, no secret, no token: just the publishable key. Simplest path.
///  • Auto-login   — your backend mints a one-time token (MintClient), then silent sign-in.
struct ContentView: View {
    @State private var status = "Choose a login mode to open the embed."
    @State private var presented = false
    @State private var mode: ApplaudIQEmbed.Mode = .manual
    @State private var token: String?
    @State private var busy = false

    var body: some View {
        VStack(spacing: 20) {
            Text("Applaud IQ — iOS embed example")
                .font(.headline)

            VStack(spacing: 12) {
                // Manual login needs only the publishable key. (Styled manually so the
                // example runs on iOS 14 — .borderedProminent/.bordered are iOS 15+.)
                Button {
                    mode = .manual
                    token = nil
                    presented = true
                } label: {
                    Label("Manual login", systemImage: "person.crop.circle")
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.accentColor)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }

                Button {
                    Task { await startAuto() }
                } label: {
                    HStack {
                        if busy { ProgressView().padding(.trailing, 4) }
                        Label("Auto-login", systemImage: "bolt.fill")
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.accentColor, lineWidth: 1))
                    .foregroundColor(.accentColor)
                }
                .disabled(busy)
            }
            .padding(.horizontal)

            Text(status)
                .font(.footnote)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .padding()
        .fullScreenCover(isPresented: $presented) {
            VStack(spacing: 0) {
                // Host chrome: the SDK view is chrome-less, so provide a way back to this screen.
                HStack {
                    Button {
                        presented = false
                    } label: {
                        HStack(spacing: 2) {
                            Image(systemName: "chevron.left")
                            Text("Back")
                        }
                    }
                    Spacer()
                }
                .overlay(
                    Text(mode == .auto ? "Auto-login" : "Manual login")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                )
                .padding(.horizontal)
                .padding(.vertical, 10)

                Divider()

                EmbedView(mode: mode, token: token, status: $status) { presented = false }
                    .ignoresSafeArea(edges: .bottom)  // fill to the home indicator; header stays in safe area
            }
        }
    }

    private func startAuto() async {
        busy = true
        status = "Minting a one-time token…"
        // Always open the embed in auto mode. On mint failure we open with a nil token so the SDK
        // sends `init-error` and the PORTAL shows the error itself (centralized error UI — same as the
        // web SDK; the host app renders no error of its own). See the employee portal's /embed handling.
        token = try? await MintClient.getEmbedToken()
        mode = .auto
        busy = false
        status = token == nil ? "Opening — the portal will show any sign-in error…" : "Token minted — opening…"
        presented = true
    }
}
