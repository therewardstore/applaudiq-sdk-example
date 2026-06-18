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
            EmbedView(mode: mode, token: token, status: $status) { presented = false }
                .ignoresSafeArea()
        }
    }

    private func startAuto() async {
        busy = true
        status = "Minting a one-time token…"
        do {
            token = try await MintClient.getEmbedToken()
            mode = .auto
            presented = true
            status = "Token minted — opening…"
        } catch {
            status = "Auto-login: \(error.localizedDescription)"
        }
        busy = false
    }
}
