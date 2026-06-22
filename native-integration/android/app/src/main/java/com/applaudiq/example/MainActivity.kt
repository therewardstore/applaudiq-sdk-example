package com.applaudiq.example

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import com.applaudiq.embed.ApplaudIQEmbed
import kotlin.concurrent.thread

/**
 * The example in KOTLIN. Two ways to open the embed — both also handle SSO automatically (the SDK
 * opens Custom Tabs and relays the result back):
 *  • Manual login — no server, no secret, no token: just the publishable key. Simplest path.
 *  • Auto-login   — your backend mints a one-time token (MintClient), then silent sign-in.
 *
 * Tapping a card calls `ApplaudIQEmbed.open(...)`, which launches the SDK's own full-screen Activity
 * (real navigation + back stack). The same example written in Java lives in [MainActivityJava].
 */
class MainActivity : AppCompatActivity() {

    private lateinit var statusPill: LinearLayout
    private lateinit var statusIcon: ImageView
    private lateinit var statusText: TextView
    private lateinit var autoSpinner: ProgressBar
    private lateinit var autoChevron: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // White status-bar icons on the dark gradient hero.
        WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightStatusBars = false

        ExampleUi.applyInsets(findViewById(R.id.hero), findViewById(R.id.scroll_content))

        statusPill = findViewById(R.id.status_pill)
        statusIcon = findViewById(R.id.status_icon)
        statusText = findViewById(R.id.status_text)
        autoSpinner = findViewById(R.id.auto_spinner)
        autoChevron = findViewById(R.id.auto_chevron)
        setStatus(ExampleUi.IDLE, "Choose a login mode to open the embed.")

        findViewById<View>(R.id.card_manual).setOnClickListener { openManual() }
        findViewById<View>(R.id.card_auto).setOnClickListener { openAuto() }
        findViewById<View>(R.id.java_link).setOnClickListener {
            startActivity(Intent(this, MainActivityJava::class.java))
        }
    }

    private fun setStatus(color: Int, message: String) =
        ExampleUi.setStatus(statusPill, statusIcon, statusText, color, message)

    private fun openManual() {
        setStatus(ExampleUi.IDLE, "Opening manual login…")
        ApplaudIQEmbed.open(
            this,
            ApplaudIQEmbed.Config(
                key = Config.PUBLISHABLE_KEY,
                baseUrl = Config.BASE_URL,
                mode = ApplaudIQEmbed.Mode.MANUAL,
                onReady = { setStatus(ExampleUi.SUCCESS, "Signed in") },
                onError = { msg -> setStatus(ExampleUi.ERROR, "Error: $msg") },
                onClose = { },
            ),
        )
    }

    private fun openAuto() {
        setStatus(ExampleUi.LOADING, "Minting a one-time token…")
        autoSpinner.visibility = View.VISIBLE
        autoChevron.visibility = View.GONE
        // Mint off the main thread. On failure we still open in auto mode with a null token so the SDK
        // sends `init-error` and the PORTAL shows the error itself (centralized error UI, like the web SDK).
        thread {
            val token = try { MintClient.getEmbedToken() } catch (e: Exception) { null }
            runOnUiThread {
                autoSpinner.visibility = View.GONE
                autoChevron.visibility = View.VISIBLE
                setStatus(
                    if (token == null) ExampleUi.IDLE else ExampleUi.LOADING,
                    if (token == null) "Opening — the portal will show any sign-in error…" else "Token minted — opening…",
                )
                ApplaudIQEmbed.open(
                    this,
                    ApplaudIQEmbed.Config(
                        key = Config.PUBLISHABLE_KEY,
                        token = token,
                        baseUrl = Config.BASE_URL,
                        mode = ApplaudIQEmbed.Mode.AUTO,
                        onReady = { setStatus(ExampleUi.SUCCESS, "Signed in") },
                        onAuthPending = { setStatus(ExampleUi.PENDING, "Pending HR approval") },
                        onError = { msg -> setStatus(ExampleUi.ERROR, "Error: $msg") },
                        onClose = { },
                        onSignOut = { },
                    ),
                )
            }
        }
    }
}
