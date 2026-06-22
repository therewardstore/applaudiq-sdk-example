import ApplaudIQEmbed
import SwiftUI
import UIKit

// MARK: - Brand theme (sampled from the Applaud IQ logo — the SDK theme)

enum Brand {
    static let violet = Color(hex: 0x7A3AED)
    static let indigo = Color(hex: 0x5146E5)
    static let surface = Color(hex: 0xF6F5FF)
    static let ink = Color(hex: 0x1B1630)
    static let muted = Color(hex: 0x6B6786)
    static let cardBorder = Color(hex: 0xE8E6F6)
    static let gradient = LinearGradient(
        gradient: Gradient(colors: [violet, indigo]),
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
}

extension Color {
    init(hex: UInt) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }
}

/// Drives the status pill colour (mirrors the Flutter example's `_Status`).
enum EmbedStatus {
    case idle, loading, success, pending, error

    var color: Color {
        switch self {
        case .idle: return Brand.muted
        case .loading: return Brand.violet
        case .success: return Color(hex: 0x1E9E62)
        case .pending: return Color(hex: 0xC07A00)
        case .error: return Color(hex: 0xD23B53)
        }
    }

    var icon: String {
        switch self {
        case .idle: return "info.circle"
        case .loading: return "arrow.triangle.2.circlepath"
        case .success: return "checkmark.circle.fill"
        case .pending: return "hourglass"
        case .error: return "exclamationmark.triangle.fill"
        }
    }
}

// MARK: - Home

/// Two ways to open the embed — Manual (publishable key only) and Auto (server-minted token).
/// The embed is a REAL pushed screen on the navigation stack (NavigationLink), not a show/hide toggle.
struct ContentView: View {
    @State private var statusKind: EmbedStatus = .idle
    @State private var status = "Choose a login mode to open the embed."
    @State private var busy = false

    // Push-navigation state — selecting a mode pushes the embed onto the stack.
    @State private var pushed = false
    @State private var pushMode: ApplaudIQEmbed.Mode = .manual
    @State private var pushToken: String?

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                hero
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("CHOOSE A LOGIN MODE")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Brand.muted)
                            .padding(.bottom, 14)

                        ModeCard(
                            icon: "lock.fill",
                            title: "Manual login",
                            subtitle: "Employees sign in inside the embed (email + SSO). No server needed.",
                            disabled: busy,
                            action: openManual
                        )
                        .padding(.bottom, 12)

                        ModeCard(
                            icon: "bolt.fill",
                            title: "Auto-login",
                            subtitle: "Silent sign-in with a one-time token minted on your server.",
                            busy: busy,
                            disabled: busy,
                            action: { Task { await openAuto() } }
                        )
                        .padding(.bottom, 22)

                        StatusPill(kind: statusKind, message: status)

                        Text("ApplaudIQEmbed · published SDK")
                            .font(.system(size: 12))
                            .foregroundColor(Brand.muted)
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding(.top, 18)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 28)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Brand.surface.edgesIgnoringSafeArea(.all))
            .navigationBarHidden(true)
            .background(
                NavigationLink(destination: embedScreen, isActive: $pushed) { EmptyView() }
            )
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }

    // The pushed embed screen — full-screen (no nav-bar chrome), like the Flutter/Android examples.
    // It's still a real navigation push: a left-edge swipe pops back (see the UINavigationController
    // extension below, which keeps the swipe-back gesture working with the bar hidden).
    private var embedScreen: some View {
        EmbedView(
            mode: pushMode,
            token: pushToken,
            onStatus: { kind, msg in
                statusKind = kind
                status = msg
            },
            onClose: { pushed = false }
        )
        .edgesIgnoringSafeArea(.bottom)
        .navigationBarHidden(true)
    }

    // MARK: hero

    private var hero: some View {
        VStack(alignment: .leading, spacing: 0) {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white)
                .frame(width: 64, height: 64)
                .overlay(
                    Image(systemName: "sparkles")
                        .font(.system(size: 30, weight: .semibold))
                        .foregroundColor(Brand.violet)
                )
                .shadow(color: Color.black.opacity(0.18), radius: 16, x: 0, y: 6)
                .padding(.bottom, 18)

            Text("Applaud IQ")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white)
            Text("iOS embed example")
                .font(.system(size: 15))
                .foregroundColor(Color.white.opacity(0.82))
                .padding(.top, 4)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, topInset + 22)
        .padding(.horizontal, 24)
        .padding(.bottom, 30)
        .background(Brand.gradient)
        .clipShape(RoundedCornersBottom(radius: 28))
        .edgesIgnoringSafeArea(.top)
    }

    private var topInset: CGFloat {
        (UIApplication.shared.windows.first { $0.isKeyWindow }?.safeAreaInsets.top) ?? 47
    }

    // MARK: actions

    private func openManual() {
        statusKind = .idle
        status = "Opening manual login…"
        pushMode = .manual
        pushToken = nil
        pushed = true
    }

    private func openAuto() async {
        busy = true
        statusKind = .loading
        status = "Minting a one-time token…"
        // Open in auto mode either way. On mint failure we open with a nil token so the SDK sends
        // `init-error` and the PORTAL renders the error itself (centralised error UI — like the web SDK).
        pushToken = try? await MintClient.getEmbedToken()
        pushMode = .auto
        busy = false
        if pushToken == nil {
            statusKind = .idle
            status = "Opening — the portal will show any sign-in error…"
        } else {
            statusKind = .loading
            status = "Token minted — opening…"
        }
        pushed = true
    }
}

// MARK: - Components

/// A tappable login-mode card: gradient icon tile + title + description + chevron/spinner.
private struct ModeCard: View {
    let icon: String
    let title: String
    let subtitle: String
    var busy: Bool = false
    var disabled: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                RoundedRectangle(cornerRadius: 13, style: .continuous)
                    .fill(Brand.gradient)
                    .frame(width: 46, height: 46)
                    .overlay(
                        Image(systemName: icon)
                            .font(.system(size: 22, weight: .semibold))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Brand.ink)
                    Text(subtitle)
                        .font(.system(size: 13))
                        .foregroundColor(Brand.muted)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer(minLength: 10)

                if busy {
                    ProgressView()
                } else {
                    Image(systemName: "chevron.right").foregroundColor(Brand.muted)
                }
            }
            .padding(16)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Brand.cardBorder, lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(disabled)
        .opacity(disabled && !busy ? 0.55 : 1)
    }
}

/// Colour-coded status indicator driven by the SDK callbacks.
private struct StatusPill: View {
    let kind: EmbedStatus
    let message: String

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: kind.icon)
                .font(.system(size: 15))
                .foregroundColor(kind.color)
            Text(message)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(kind.color)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(kind.color.opacity(0.10))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(kind.color.opacity(0.25), lineWidth: 1)
        )
    }
}

/// Rounds only the bottom corners (for the gradient hero that bleeds under the status bar).
private struct RoundedCornersBottom: Shape {
    var radius: CGFloat

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: [.bottomLeft, .bottomRight],
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

// The embed is shown full-screen with the navigation bar hidden (no "Back" header). iOS normally
// disables the edge-swipe "back" gesture when the bar is hidden — this restores it so the embed can
// still be dismissed with a left-edge swipe (matching the Android hardware-back behaviour).
extension UINavigationController: @retroactive UIGestureRecognizerDelegate {
    override open func viewDidLoad() {
        super.viewDidLoad()
        interactivePopGestureRecognizer?.delegate = self
    }

    public func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        viewControllers.count > 1
    }
}
