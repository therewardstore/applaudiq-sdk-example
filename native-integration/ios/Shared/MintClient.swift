import Foundation

/// Auto-login only. Produces the one-time `embedToken` the SDK needs. Two paths:
///
///  • PRODUCTION (default): fetch it from YOUR backend (`MINT_ENDPOINT`), which holds the
///    `aiq_embed_` SECRET and calls `POST <api>/api/v1/embed/sessions` server-side. See
///    ../../MINTING.md and the canonical route in web-integration/nextjs/app/api/mint/route.ts.
///
///  • ⚠️ DEMO/TEST ONLY: if `TEST_EMBED_SECRET` (Config.swift) is set, the app mints the token
///    ITSELF so auto-login runs with no backend — the iOS analog of the web examples' dev proxy.
///    The secret must NEVER ship in a real app; this exists purely so you can try auto-login
///    locally. Leave `TEST_EMBED_SECRET` empty and wire `MINT_ENDPOINT` for anything real.
///
/// Manual login does NOT use this at all.
enum MintClient {
    struct MintResponse: Decodable { let embedToken: String }
    // The gateway wraps success in a `data` envelope; tolerate both shapes.
    private struct Envelope: Decodable { let data: MintResponse? }

    static func getEmbedToken() async throws -> String {
        if !TEST_EMBED_SECRET.isEmpty {
            return try await mintInAppForTesting()
        }
        return try await mintViaBackend()
    }

    // MARK: production — your hosted mint endpoint holds the secret
    private static func mintViaBackend() async throws -> String {
        var request = URLRequest(url: MINT_ENDPOINT)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        // Your backend identifies the employee from its own session — never trust a
        // client-supplied identity. This example sends an empty body.
        request.httpBody = Data("{}".utf8)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw NSError(
                domain: "MintClient", code: 1,
                userInfo: [NSLocalizedDescriptionKey: "Mint request failed — wire MINT_ENDPOINT to your server (see MINTING.md)."]
            )
        }
        return try decodeToken(from: data)
    }

    // MARK: ⚠️ DEMO/TEST ONLY — mint in-app with the secret (never do this in production)
    // This is exactly the request your backend would make; here the app makes it directly with
    // the secret from Config.TEST_EMBED_SECRET. It works because a native URLSession call isn't
    // bound by browser CORS — but it also means the secret lives in the app, which is why this is
    // for local testing ONLY. The production mint lives on a server you control (see MINTING.md
    // and web-integration/nextjs/app/api/mint/route.ts).
    private static func mintInAppForTesting() async throws -> String {
        var request = URLRequest(url: BASE_URL.appendingPathComponent("api/v1/embed/sessions"))
        request.httpMethod = "POST"
        request.setValue("Bearer \(TEST_EMBED_SECRET)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: Any] = ["employee": ["email": DEMO_EMAIL], "autoProvision": true]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            let status = (response as? HTTPURLResponse)?.statusCode ?? -1
            throw NSError(
                domain: "MintClient", code: 2,
                userInfo: [NSLocalizedDescriptionKey: "Test mint failed (HTTP \(status)) — check TEST_EMBED_SECRET / BASE_URL."]
            )
        }
        return try decodeToken(from: data)
    }

    // Unwrap `{ data: { embedToken } }` or a bare `{ embedToken }`.
    private static func decodeToken(from data: Data) throws -> String {
        if let token = (try? JSONDecoder().decode(Envelope.self, from: data))?.data?.embedToken {
            return token
        }
        return try JSONDecoder().decode(MintResponse.self, from: data).embedToken
    }
}
