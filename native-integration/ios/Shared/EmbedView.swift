import ApplaudIQEmbed
import SwiftUI
import UIKit

/// Wraps the SDK's `UIViewController` (a WKWebView hosting <baseUrl>/embed) so it can be
/// presented from SwiftUI. The publishable key is passed in BOTH modes; `token` is set only
/// for auto-login. The SDK's lifecycle callbacks are forwarded to a bound status string.
struct EmbedView: UIViewControllerRepresentable {
    let mode: ApplaudIQEmbed.Mode
    let token: String?
    @Binding var status: String
    let onClose: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        var options = ApplaudIQEmbed.Options(mode: mode, token: token)
        options.onReady = { status = "Signed in — recognition feed loaded." }
        options.onAuthPending = { status = "Signed in — waiting for HR approval." }
        options.onError = { message in status = "Error: \(message)" }
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
