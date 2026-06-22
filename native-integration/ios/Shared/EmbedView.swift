import ApplaudIQEmbed
import SwiftUI
import UIKit

/// Wraps the SDK's `UIViewController` (a WKWebView hosting <baseUrl>/embed) so it can be
/// pushed from SwiftUI. The publishable key is passed in BOTH modes; `token` is set only
/// for auto-login. The SDK's lifecycle callbacks are forwarded to the host as (status, message).
struct EmbedView: UIViewControllerRepresentable {
    let mode: ApplaudIQEmbed.Mode
    let token: String?
    let onStatus: (EmbedStatus, String) -> Void
    let onClose: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        var options = ApplaudIQEmbed.Options(mode: mode, token: token)
        options.onReady = { onStatus(.success, "Signed in") }
        options.onAuthPending = { onStatus(.pending, "Pending HR approval") }
        options.onError = { message in onStatus(.error, "Error: \(message)") }
        options.onClose = { onClose() }

        return ApplaudIQEmbed.makeViewController(
            // SSO_CALLBACK is THIS app's own scheme (registered in Info.plist CFBundleURLSchemes); the SDK
            // sends it as `native_redirect` so the SSO code comes back to this app, not the brand `applaudiq://`.
            config: .init(key: PUBLISHABLE_KEY, baseURL: BASE_URL, ssoCallback: SSO_CALLBACK),
            options: options
        )
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
