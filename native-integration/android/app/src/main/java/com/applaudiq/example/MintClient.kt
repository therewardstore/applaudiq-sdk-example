package com.applaudiq.example

import org.json.JSONObject
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL

/**
 * Auto-login only. Produces the one-time `embedToken` the SDK needs. Two paths:
 *
 *  • PRODUCTION (default): fetch it from YOUR backend ([Config.MINT_ENDPOINT]), which holds the
 *    `aiq_embed_` SECRET and calls `POST <api>/api/v1/embed/sessions` server-side. See ../../MINTING.md.
 *
 *  • ⚠️ DEMO/TEST ONLY: if [Config.TEST_EMBED_SECRET] is set, the app mints the token ITSELF so
 *    auto-login runs with no backend — the Android analog of the web examples' dev proxy. The secret
 *    must NEVER ship in a real app; this exists purely so you can try auto-login locally.
 *
 * Manual login does NOT use this at all. Networking is a plain blocking call — run it OFF the main thread.
 */
object MintClient {

    /** @return the one-time embedToken. Throws on failure. Call from a background thread. */
    fun getEmbedToken(): String =
        if (Config.TEST_EMBED_SECRET.isNotEmpty()) mintInAppForTesting() else mintViaBackend()

    // PRODUCTION — your hosted mint endpoint holds the secret and identifies the employee from its own session.
    private fun mintViaBackend(): String {
        val conn = (URL(Config.MINT_ENDPOINT).openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json")
            doOutput = true
        }
        conn.outputStream.use { it.writeJson("{}") }
        return conn.readToken("Mint request failed — wire MINT_ENDPOINT to your server (see MINTING.md).")
    }

    // ⚠️ DEMO/TEST ONLY — mint in-app with the secret (never do this in production; the secret is
    // extractable from the APK). This is exactly the request your backend would make.
    private fun mintInAppForTesting(): String {
        val conn = (URL("${Config.BASE_URL.trimEnd('/')}/api/v1/embed/sessions").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Authorization", "Bearer ${Config.TEST_EMBED_SECRET}")
            setRequestProperty("Content-Type", "application/json")
            doOutput = true
        }
        val body = JSONObject()
            .put("employee", JSONObject().put("email", Config.DEMO_EMAIL))
            .put("autoProvision", true)
        conn.outputStream.use { it.writeJson(body.toString()) }
        return conn.readToken("Test mint failed — check TEST_EMBED_SECRET / BASE_URL.")
    }

    private fun OutputStream.writeJson(s: String) = write(s.toByteArray(Charsets.UTF_8))

    // Unwrap `{ data: { embedToken } }` or a bare `{ embedToken }`.
    private fun HttpURLConnection.readToken(failMsg: String): String {
        val code = responseCode
        if (code !in 200..299) {
            errorStream?.close()
            throw RuntimeException("$failMsg (HTTP $code)")
        }
        val text = inputStream.bufferedReader().use { it.readText() }
        val root = JSONObject(text)
        val obj = root.optJSONObject("data") ?: root
        return obj.optString("embedToken").ifEmpty {
            throw RuntimeException("Mint response had no embedToken")
        }
    }
}
